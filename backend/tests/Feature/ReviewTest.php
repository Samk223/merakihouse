<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
    
    $this->category = Category::create([
        'name' => 'Living Room',
        'slug' => 'living-room',
    ]);
    
    $this->product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Wooden Coffee Table',
        'slug' => 'wooden-coffee-table',
        'sku' => 'TAB-001',
        'price' => 4500.00,
        'stock' => 5,
        'track_inventory' => true,
        'is_active' => true,
    ]);

    $this->otherProduct = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Sofa Set',
        'slug' => 'sofa-set',
        'sku' => 'SOF-001',
        'price' => 25000.00,
        'stock' => 2,
        'track_inventory' => true,
        'is_active' => true,
    ]);
});

test('guest cannot create, update, or delete review', function () {
    $this->postJson('/api/reviews', [
        'product_id' => $this->product->id,
        'rating' => 5,
        'comment' => 'Amazing product',
    ])->assertStatus(401);

    $this->patchJson('/api/reviews/1', [
        'rating' => 4,
        'comment' => 'Updated comment',
    ])->assertStatus(401);

    $this->deleteJson('/api/reviews/1')->assertStatus(401);
});

test('user cannot review a product they never purchased', function () {
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/reviews', [
        'product_id' => $this->product->id,
        'rating' => 5,
        'comment' => 'Loved it',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['product_id'])
        ->assertJsonFragment([
            'message' => 'You are not eligible to review this product.'
        ]);
});

test('user cannot review a product from an order that is not Delivered', function () {
    // Create order with status 'Pending'
    $order = Order::create([
        'user_id' => $this->user->id,
        'order_number' => 'MH-2026-000001',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 4500.00,
        'shipping' => 0.00,
        'total' => 4500.00,
        'shipping_address_snapshot' => ['full_name' => 'Rajesh Kumar'],
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'price' => 4500.00,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/reviews', [
        'product_id' => $this->product->id,
        'rating' => 4,
        'comment' => 'It is okay, but not delivered yet.',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['product_id']);
});

test('user who purchased and has Delivered status order can review product', function () {
    // Create order with status 'Delivered'
    $order = Order::create([
        'user_id' => $this->user->id,
        'order_number' => 'MH-2026-000001',
        'status' => 'Delivered',
        'payment_status' => 'Paid',
        'subtotal' => 4500.00,
        'shipping' => 0.00,
        'total' => 4500.00,
        'shipping_address_snapshot' => ['full_name' => 'Rajesh Kumar'],
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'price' => 4500.00,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/reviews', [
        'product_id' => $this->product->id,
        'rating' => 5,
        'comment' => 'Excellent craftsmanship.',
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Review submitted successfully.',
            'data' => [
                'user_id' => $this->user->id,
                'product_id' => $this->product->id,
                'rating' => 5,
                'comment' => 'Excellent craftsmanship.',
            ]
        ]);

    $this->assertDatabaseHas('reviews', [
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'rating' => 5,
        'comment' => 'Excellent craftsmanship.',
    ]);
});

test('duplicate reviews are blocked', function () {
    // Create order with status 'Delivered'
    $order = Order::create([
        'user_id' => $this->user->id,
        'order_number' => 'MH-2026-000001',
        'status' => 'Delivered',
        'payment_status' => 'Paid',
        'subtotal' => 4500.00,
        'shipping' => 0.00,
        'total' => 4500.00,
        'shipping_address_snapshot' => ['full_name' => 'Rajesh Kumar'],
    ]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'price' => 4500.00,
    ]);

    // Create review first time
    Review::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'rating' => 5,
        'comment' => 'First review content.',
    ]);

    // Try creating duplicate review
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/reviews', [
        'product_id' => $this->product->id,
        'rating' => 4,
        'comment' => 'Second review attempt.',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['product_id'])
        ->assertJsonFragment([
            'message' => 'You have already reviewed this product.'
        ]);
});

test('only review owner can update review, and only update rating and comment', function () {
    $review = Review::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'rating' => 4,
        'comment' => 'Initial comment',
    ]);

    // Try to update as otherUser
    $responseOther = $this->actingAs($this->otherUser, 'sanctum')->patchJson("/api/reviews/{$review->id}", [
        'rating' => 5,
        'comment' => 'Hacked review',
    ]);
    $responseOther->assertStatus(403);

    // Update as owner
    $responseOwner = $this->actingAs($this->user, 'sanctum')->patchJson("/api/reviews/{$review->id}", [
        'rating' => 5,
        'comment' => 'Updated comment',
        'user_id' => $this->otherUser->id, // Attempt to modify non-editable field
    ]);

    $responseOwner->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Review updated successfully.',
            'data' => [
                'id' => $review->id,
                'user_id' => $this->user->id, // Remains unchanged
                'rating' => 5,
                'comment' => 'Updated comment',
            ]
        ]);

    $this->assertDatabaseHas('reviews', [
        'id' => $review->id,
        'user_id' => $this->user->id,
        'rating' => 5,
        'comment' => 'Updated comment',
    ]);
});

test('only review owner can delete review', function () {
    $review = Review::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'rating' => 4,
        'comment' => 'To be deleted',
    ]);

    // Try to delete as otherUser
    $this->actingAs($this->otherUser, 'sanctum')->deleteJson("/api/reviews/{$review->id}")
        ->assertStatus(403);

    // Delete as owner
    $this->actingAs($this->user, 'sanctum')->deleteJson("/api/reviews/{$review->id}")
        ->assertStatus(200);

    $this->assertDatabaseMissing('reviews', [
        'id' => $review->id,
    ]);
});

test('public reviews endpoint returns rating details and aggregates', function () {
    // Create multiple reviews
    Review::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
        'rating' => 5,
        'comment' => 'Amazing item!',
    ]);

    Review::create([
        'user_id' => $this->otherUser->id,
        'product_id' => $this->product->id,
        'rating' => 4,
        'comment' => 'Pretty good table.',
    ]);

    // Test with product ID
    $responseById = $this->getJson("/api/products/{$this->product->id}/reviews");
    $responseById->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'average_rating',
                'total_reviews',
                'reviews' => [
                    '*' => [
                        'id',
                        'rating',
                        'comment',
                        'review_date',
                        'reviewer_name',
                    ]
                ]
            ]
        ])
        ->assertJson([
            'data' => [
                'average_rating' => 4.5,
                'total_reviews' => 2,
            ]
        ]);

    // Test with product Slug
    $responseBySlug = $this->getJson("/api/products/{$this->product->slug}/reviews");
    $responseBySlug->assertStatus(200)
        ->assertJson([
            'data' => [
                'average_rating' => 4.5,
                'total_reviews' => 2,
            ]
        ]);
});
