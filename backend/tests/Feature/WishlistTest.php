<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->category = Category::create([
        'name' => 'Home Decor',
        'slug' => 'home-decor',
    ]);
    $this->product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Scented Candle',
        'slug' => 'scented-candle',
        'sku' => 'SC-001',
        'price' => 25.00,
    ]);
});

test('unauthenticated user cannot access wishlist', function () {
    $this->getJson('/api/wishlist')->assertStatus(401);
    $this->postJson('/api/wishlist', ['product_id' => $this->product->id])->assertStatus(401);
    $this->deleteJson('/api/wishlist/' . $this->product->id)->assertStatus(401);
});

test('user can view their wishlist with eager loaded products', function () {
    Wishlist::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/wishlist');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                '*' => [
                    'id',
                    'user_id',
                    'product_id',
                    'created_at',
                    'updated_at',
                    'product' => [
                        'id',
                        'name',
                        'price',
                    ],
                ],
            ],
        ]);
});

test('user can add a product to their wishlist', function () {
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/wishlist', [
        'product_id' => $this->product->id,
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Product added to wishlist successfully.',
            'data' => [
                'user_id' => $this->user->id,
                'product_id' => $this->product->id,
                'product' => [
                    'id' => $this->product->id,
                    'name' => 'Scented Candle',
                ]
            ],
        ]);

    $this->assertDatabaseHas('wishlists', [
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
    ]);
});

test('user cannot add non-existent product to wishlist', function () {
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/wishlist', [
        'product_id' => 999,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['product_id']);
});

test('user cannot add duplicate product to wishlist', function () {
    // Add first time
    Wishlist::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
    ]);

    // Try to add second time
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/wishlist', [
        'product_id' => $this->product->id,
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['product_id'])
        ->assertJson([
            'errors' => [
                'product_id' => [
                    'This product is already in your wishlist.'
                ]
            ]
        ]);
});

test('user can delete a product from their wishlist', function () {
    Wishlist::create([
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->deleteJson('/api/wishlist/' . $this->product->id);

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Product removed from wishlist successfully.',
        ]);

    $this->assertDatabaseMissing('wishlists', [
        'user_id' => $this->user->id,
        'product_id' => $this->product->id,
    ]);
});

test('deleting a product not in wishlist returns 404', function () {
    $response = $this->actingAs($this->user, 'sanctum')->deleteJson('/api/wishlist/' . $this->product->id);

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'Product not found in your wishlist.',
        ]);
});
