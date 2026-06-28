<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->category = Category::create([
        'name' => 'Furniture',
        'slug' => 'furniture',
    ]);
    
    // Product with stock = 5
    $this->product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Design Chair',
        'slug' => 'design-chair',
        'sku' => 'CHAIR-001',
        'price' => 120.00,
        'stock' => 5,
        'track_inventory' => true,
        'is_active' => true,
    ]);

    // Product with stock = 2
    $this->product2 = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Office Lamp',
        'slug' => 'office-lamp',
        'sku' => 'LAMP-002',
        'price' => 45.00,
        'stock' => 2,
        'track_inventory' => true,
        'is_active' => true,
    ]);
});

test('guest cannot access cart endpoints', function () {
    $this->getJson('/api/cart')->assertStatus(401);
    $this->postJson('/api/cart', ['product_id' => $this->product->id])->assertStatus(401);
    $this->patchJson('/api/cart/1', ['quantity' => 2])->assertStatus(401);
    $this->deleteJson('/api/cart/1')->assertStatus(401);
});

test('empty cart returns success with zero totals', function () {
    $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/cart');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Cart retrieved successfully.',
            'data' => [
                'cart_items' => [],
                'subtotal' => '0.00',
                'shipping' => '0.00',
                'total' => '0.00',
            ]
        ]);
});

test('first product added creates cart and item', function () {
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product->id,
        'quantity' => 1,
    ]);

    // subtotal = 120.00 (under 150.00, so shipping is 15.00 flat rate)
    // total = 120.00 + 15.00 = 135.00
    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Product added to cart successfully.',
            'data' => [
                'subtotal' => '120.00',
                'shipping' => '15.00',
                'total' => '135.00',
            ]
        ]);

    $this->assertCount(1, $response->json('data.cart_items'));
    $this->assertDatabaseHas('carts', ['user_id' => $this->user->id]);
    $this->assertDatabaseHas('cart_items', ['product_id' => $this->product->id, 'quantity' => 1]);
});

test('adding existing product increments quantity instead of creating new row', function () {
    // Add product first time
    $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product->id,
        'quantity' => 1,
    ]);

    // Add same product second time
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product->id,
        'quantity' => 2,
    ]);

    // subtotal = 120.00 * 3 = 360.00 (>= 150.00, so free shipping)
    // total = 360.00
    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'data' => [
                'subtotal' => '360.00',
                'shipping' => '0.00',
                'total' => '360.00',
            ]
        ]);

    $data = $response->json('data.cart_items');
    $this->assertCount(1, $data);
    $this->assertEquals(3, $data[0]['quantity']);
    $this->assertEquals(1, CartItem::count());
});

test('user can update cart item quantity', function () {
    // Add item first
    $setup = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product2->id,
        'quantity' => 1,
    ]);
    $itemId = $setup->json('data.cart_items.0.id');

    // Update quantity to 2
    $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/cart/{$itemId}", [
        'quantity' => 2,
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Cart item updated successfully.',
            'data' => [
                'subtotal' => '90.00',
                'shipping' => '15.00',
                'total' => '105.00',
            ]
        ]);

    $this->assertEquals(2, CartItem::find($itemId)->quantity);
});

test('updating quantity requires min 1', function () {
    $setup = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product2->id,
        'quantity' => 1,
    ]);
    $itemId = $setup->json('data.cart_items.0.id');

    $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/cart/{$itemId}", [
        'quantity' => 0,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['quantity']);
});

test('adding product or updating quantity respects stock limit', function () {
    // 1. Add more than stock limit (stock is 5)
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product->id,
        'quantity' => 6,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['quantity']);

    // 2. Add within limit first
    $setup = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product->id,
        'quantity' => 3,
    ]);
    $itemId = $setup->json('data.cart_items.0.id');

    // 3. Try to update beyond stock limit
    $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/cart/{$itemId}", [
        'quantity' => 6,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['quantity']);
});

test('user can delete a cart item', function () {
    // Add two items
    $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product->id,
        'quantity' => 1,
    ]);
    $setup2 = $this->actingAs($this->user, 'sanctum')->postJson('/api/cart', [
        'product_id' => $this->product2->id,
        'quantity' => 1,
    ]);
    
    $itemId = $setup2->json('data.cart_items.1.id');
    $this->assertEquals(2, CartItem::count());

    // Delete item
    $response = $this->actingAs($this->user, 'sanctum')->deleteJson("/api/cart/{$itemId}");

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Cart item removed successfully.',
            'data' => [
                'subtotal' => '120.00',
                'shipping' => '15.00',
                'total' => '135.00',
            ]
        ]);

    $this->assertCount(1, $response->json('data.cart_items'));
    $this->assertEquals(1, CartItem::count());
});

test('composite unique constraint prevents duplicate inserts in database', function () {
    $cart = Cart::create(['user_id' => $this->user->id]);
    
    CartItem::create([
        'cart_id' => $cart->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
    ]);

    $this->expectException(QueryException::class);
    
    // Attempting to bypass logic and insert directly
    CartItem::insert([
        'cart_id' => $cart->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);
});
