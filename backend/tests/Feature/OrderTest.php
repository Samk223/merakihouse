<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    
    $this->category = Category::create([
        'name' => 'Bedroom',
        'slug' => 'bedroom',
    ]);
    
    $this->product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Premium Bedsheet',
        'slug' => 'premium-bedsheet',
        'sku' => 'BED-001',
        'price' => 750.00,
        'stock' => 10,
        'track_inventory' => true,
        'is_active' => true,
    ]);

    // Create a mock order for user
    $this->order = Order::create([
        'user_id' => $this->user->id,
        'order_number' => 'MH-2026-000001',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 750.00,
        'shipping' => 99.00,
        'total' => 849.00,
        'shipping_address_snapshot' => [
            'full_name' => 'Rajesh Kumar',
            'phone' => '9876543210',
            'address_line_1' => 'Flat 401, Sapphire Apartments',
            'address_line_2' => 'Indiranagar',
            'city' => 'Bengaluru',
            'state' => 'Karnataka',
            'postal_code' => '560038',
            'country' => 'India',
        ],
    ]);

    // Create a mock order item
    $this->orderItem = OrderItem::create([
        'order_id' => $this->order->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'price' => 750.00,
    ]);
});

test('guest cannot view orders list or details', function () {
    $this->getJson('/api/orders')->assertStatus(401);
    $this->getJson("/api/orders/{$this->order->id}")->assertStatus(401);
});

test('user can view their own order history list', function () {
    $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/orders');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'order_number',
                    'status',
                    'payment_status',
                    'subtotal',
                    'shipping',
                    'total',
                    'currency',
                    'created_at',
                ]
            ]
        ])
        ->assertJsonFragment([
            'order_number' => $this->order->order_number,
            'currency' => 'INR',
        ]);
});

test('user can view single order detail with eager loaded items', function () {
    $response = $this->actingAs($this->user, 'sanctum')->getJson("/api/orders/{$this->order->id}");

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Order details retrieved successfully.',
            'data' => [
                'order' => [
                    'id' => $this->order->id,
                    'order_number' => $this->order->order_number,
                    'subtotal' => '750.00',
                    'shipping' => '99.00',
                    'total' => '849.00',
                    'shipping_address_snapshot' => [
                        'full_name' => 'Rajesh Kumar',
                        'city' => 'Bengaluru',
                    ]
                ],
                'currency' => 'INR',
            ]
        ]);

    $data = $response->json('data.order_items');
    $this->assertCount(1, $data);
    $this->assertEquals($this->product->id, $data[0]['product_id']);
    $this->assertEquals('Premium Bedsheet', $data[0]['product']['name']);
});

test('user cannot access another users order', function () {
    // Create order for otherUser
    $otherOrder = Order::create([
        'user_id' => $this->otherUser->id,
        'order_number' => 'MH-2026-000002',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 300.00,
        'shipping' => 99.00,
        'total' => 399.00,
        'shipping_address_snapshot' => [
            'full_name' => 'Other Person',
            'phone' => '9876543210',
            'address_line_1' => 'Line 1',
            'city' => 'City',
            'state' => 'State',
            'postal_code' => '110001',
            'country' => 'India',
        ],
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->getJson("/api/orders/{$otherOrder->id}");

    $response->assertStatus(403);
});

test('order number matches configured unique format', function () {
    $this->assertNotNull($this->order->order_number);
    // Regex verification: starts with MH-, followed by 4 digits for year, followed by - and 6 digits number (e.g. MH-2026-000001)
    $this->assertMatchesRegularExpression('/^MH-\d{4}-\d{6}$/', $this->order->order_number);
});
