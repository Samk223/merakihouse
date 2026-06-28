<?php

use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    $this->category = \App\Models\Category::create([
        'name' => 'Living Room',
        'slug' => 'living-room',
    ]);

    // Product 1: price = 300, stock = 5
    $this->product1 = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Cushion Cover',
        'slug' => 'cushion-cover',
        'sku' => 'CUSH-001',
        'price' => 300.00,
        'stock' => 5,
        'track_inventory' => true,
        'is_active' => true,
    ]);

    // Product 2: price = 800, stock = 2
    $this->product2 = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Desk Mat',
        'slug' => 'desk-mat',
        'sku' => 'MAT-002',
        'price' => 800.00,
        'stock' => 2,
        'track_inventory' => true,
        'is_active' => true,
    ]);

    // Create address for user
    $this->address = Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'Rajesh Kumar',
        'phone' => '9876543210',
        'address_line_1' => 'Flat 401, Sapphire Apartments',
        'address_line_2' => 'Indiranagar',
        'city' => 'Bengaluru',
        'state' => 'Karnataka',
        'postal_code' => '560038',
        'country' => 'India',
        'is_default' => true,
    ]);
});

test('guest cannot access checkout endpoint', function () {
    $this->postJson('/api/checkout', ['address_id' => $this->address->id])
        ->assertStatus(401);
});

test('checkout fails if cart is empty', function () {
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $this->address->id]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['cart']);
});

test('checkout fails with invalid address ownership', function () {
    // Add item to cart
    $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
    $cart->cartItems()->create([
        'product_id' => $this->product1->id,
        'quantity' => 1,
    ]);

    // Try to checkout using otherUser's address
    $otherAddress = Address::create([
        'user_id' => $this->otherUser->id,
        'full_name' => 'Other User',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
        'country' => 'India',
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $otherAddress->id]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['address_id']);
});

test('checkout automatically uses default address if address_id is omitted', function () {
    $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
    $cart->cartItems()->create([
        'product_id' => $this->product1->id,
        'quantity' => 1,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', []); // address_id omitted

    $response->assertStatus(201)
        ->assertJsonPath('data.order.shipping_address_snapshot.full_name', 'Rajesh Kumar');
});

test('checkout validation fails if quantity exceeds stock', function () {
    $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
    $cart->cartItems()->create([
        'product_id' => $this->product1->id,
        'quantity' => 6, // stock is 5
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $this->address->id]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['quantity']);
});

test('successful checkout calculates shipping flat rate when subtotal is below threshold', function () {
    // 1. Setup Cart with total = ₹300 (below ₹999)
    $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
    $cart->cartItems()->create([
        'product_id' => $this->product1->id,
        'quantity' => 1, // 1 * 300 = 300
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $this->address->id]);

    // Subtotal = 300.00. Shipping = 99.00. Total = 399.00
    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Order placed successfully.',
            'data' => [
                'order' => [
                    'subtotal' => '300.00',
                    'shipping' => '99.00',
                    'total' => '399.00',
                    'status' => 'Pending',
                    'payment_status' => 'Pending',
                ],
                'currency' => 'INR',
            ]
        ]);

    // Check stock was reduced
    $this->product1->refresh();
    $this->assertEquals(4, $this->product1->stock);

    // Check cart items cleared
    $this->assertEquals(0, $cart->cartItems()->count());

    // Check order and items created in DB
    $this->assertEquals(1, Order::count());
    $this->assertEquals(1, OrderItem::count());

    // Check address snapshot
    $order = Order::first();
    $this->assertEquals('Rajesh Kumar', $order->shipping_address_snapshot['full_name']);
    $this->assertEquals('India', $order->shipping_address_snapshot['country']);
});

test('successful checkout calculates free shipping when subtotal is above threshold', function () {
    // Setup Cart with total = ₹1100 (above ₹999)
    $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
    $cart->cartItems()->create([
        'product_id' => $this->product1->id,
        'quantity' => 1, // 1 * 300 = 300
    ]);
    $cart->cartItems()->create([
        'product_id' => $this->product2->id,
        'quantity' => 1, // 1 * 800 = 800
    ]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $this->address->id]);

    // Subtotal = 1100.00. Shipping = 0.00. Total = 1100.00
    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'data' => [
                'order' => [
                    'subtotal' => '1100.00',
                    'shipping' => '0.00',
                    'total' => '1100.00',
                ],
            ]
        ]);

    $this->product1->refresh();
    $this->product2->refresh();
    $this->assertEquals(4, $this->product1->stock);
    $this->assertEquals(1, $this->product2->stock);
});

test('database transaction rolls back completely on query error', function () {
    $cart = Cart::firstOrCreate(['user_id' => $this->user->id]);
    $cart->cartItems()->create([
        'product_id' => $this->product1->id,
        'quantity' => 1,
    ]);

    // Force an invalid status configuration to trigger database insertion failure during transaction
    config(['commerce.default_order_status' => ['invalid_array_causing_conversion_exception']]);

    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $this->address->id]);

    // Should return 500 error due to database level exception
    $response->assertStatus(500);

    // Verify transaction rolled back:
    // 1. Order was not created
    $this->assertEquals(0, Order::count());
    // 2. Product stock remains unchanged
    $this->product1->refresh();
    $this->assertEquals(5, $this->product1->stock);
    // 3. Cart items are not deleted
    $this->assertEquals(1, $cart->cartItems()->count());
});

test('admin cannot access checkout endpoint', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin, 'sanctum')
        ->postJson('/api/checkout', ['address_id' => $this->address->id]);

    $response->assertStatus(403)
        ->assertJsonFragment([
            'success' => false,
            'message' => 'Checkout is restricted to customer accounts only.',
        ]);
});
