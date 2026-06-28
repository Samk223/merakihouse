<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->customer = User::factory()->create(['role' => 'customer']);
    $this->category = Category::create([
        'name' => 'Furniture',
        'slug' => 'furniture',
    ]);
});

test('guest cannot access admin products endpoints', function () {
    $this->getJson('/api/admin/products')->assertStatus(401);
    $this->postJson('/api/admin/products', [])->assertStatus(401);
    $this->getJson('/api/admin/products/1')->assertStatus(401);
    $this->patchJson('/api/admin/products/1', [])->assertStatus(401);
    $this->deleteJson('/api/admin/products/1')->assertStatus(401);
});

test('customer cannot access admin products endpoints', function () {
    $product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Sample Product',
        'slug' => 'sample-product',
        'sku' => 'MH-PRD-000001',
        'description' => 'A sample product description',
        'price' => 1000.00,
        'stock' => 10,
    ]);

    $this->actingAs($this->customer, 'sanctum')->getJson('/api/admin/products')->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->postJson('/api/admin/products', [])->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->getJson("/api/admin/products/{$product->id}")->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->patchJson("/api/admin/products/{$product->id}", [])->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->deleteJson("/api/admin/products/{$product->id}")->assertStatus(403);
});

test('admin can access products list and get details', function () {
    $product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Office Table',
        'slug' => 'office-table',
        'sku' => 'MH-PRD-000001',
        'description' => 'Solid wooden office table',
        'price' => 4500.00,
        'stock' => 12,
    ]);

    $responseList = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/products');
    $responseList->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'slug', 'sku', 'price', 'stock', 'category', 'media']
            ]
        ]);

    $responseDetails = $this->actingAs($this->admin, 'sanctum')->getJson("/api/admin/products/{$product->id}");
    $responseDetails->assertStatus(200)
        ->assertJsonFragment([
            'id' => $product->id,
            'name' => 'Office Table',
            'sku' => 'MH-PRD-000001',
        ]);
});

test('admin can create product with media and auto-generated slug and SKU', function () {
    $payload = [
        'category_id' => $this->category->id,
        'name' => 'Ergonomic Desk Chair',
        'description' => 'High back ergonomic chair with lumbar support',
        'short_description' => 'Comfortable chair',
        'brand' => 'Steelcase',
        'price' => 15000.00,
        'discount_price' => 13500.00,
        'gst_percentage' => 18,
        'stock' => 25,
        'low_stock_threshold' => 8,
        'featured' => true,
        'is_active' => true,
        'weight' => 15.50,
        'dimensions' => '65x65x120 cm',
        'meta_title' => 'Steelcase Ergonomic Desk Chair',
        'meta_description' => 'Buy the best ergonomic desk chair online.',
        'media' => [
            [
                'type' => 'image',
                'path' => 'products/chair_front.jpg',
                'mime_type' => 'image/jpeg',
                'alt_text' => 'Front view of chair',
                'sort_order' => 1,
                'is_primary' => true,
            ],
            [
                'type' => 'video',
                'path' => 'products/chair_review.mp4',
                'mime_type' => 'video/mp4',
                'alt_text' => 'Review video of chair',
                'sort_order' => 2,
                'is_primary' => false,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/products', $payload);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'name' => 'Ergonomic Desk Chair',
            'slug' => 'ergonomic-desk-chair',
            'sku' => 'MH-PRD-000001',
            'brand' => 'Steelcase',
            'price' => '15000.00',
            'discount_price' => '13500.00',
            'stock' => 25,
            'featured' => true,
        ]);

    $this->assertDatabaseHas('products', [
        'name' => 'Ergonomic Desk Chair',
        'slug' => 'ergonomic-desk-chair',
        'sku' => 'MH-PRD-000001',
    ]);

    $this->assertDatabaseHas('product_images', [
        'type' => 'image',
        'path' => 'products/chair_front.jpg',
        'is_primary' => true,
    ]);

    $this->assertDatabaseHas('product_images', [
        'type' => 'video',
        'path' => 'products/chair_review.mp4',
        'is_primary' => false,
    ]);
});

test('slug uniqueness collision increments suffix', function () {
    // Create first product
    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Study Desk',
        'slug' => 'study-desk',
        'sku' => 'MH-PRD-000001',
        'description' => 'A study desk',
        'price' => 3000.00,
        'stock' => 5,
    ]);

    $payload = [
        'category_id' => $this->category->id,
        'name' => 'Study Desk',
        'description' => 'Another study desk',
        'price' => 3500.00,
        'stock' => 10,
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/products', $payload);
    $response->assertStatus(201)
        ->assertJsonFragment(['slug' => 'study-desk-2']);

    $responseThird = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/products', $payload);
    $responseThird->assertStatus(201)
        ->assertJsonFragment(['slug' => 'study-desk-3']);
});

test('creation fails if discount price is higher than price', function () {
    $payload = [
        'category_id' => $this->category->id,
        'name' => 'Bad Price Product',
        'description' => 'Description here',
        'price' => 1000.00,
        'discount_price' => 1200.00,
        'stock' => 10,
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/products', $payload);
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['discount_price']);
});

test('creation fails if multiple primary media are specified', function () {
    $payload = [
        'category_id' => $this->category->id,
        'name' => 'Chair',
        'description' => 'High quality chair',
        'price' => 2000.00,
        'stock' => 5,
        'media' => [
            [
                'type' => 'image',
                'path' => 'image1.jpg',
                'is_primary' => true,
            ],
            [
                'type' => 'image',
                'path' => 'image2.jpg',
                'is_primary' => true,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/products', $payload);
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['media']);
});

test('admin can update product details and sync media', function () {
    $product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Lounge Sofa',
        'slug' => 'lounge-sofa',
        'sku' => 'MH-PRD-000001',
        'description' => 'Cozy lounge sofa',
        'price' => 25000.00,
        'stock' => 3,
    ]);

    $media1 = ProductImage::create([
        'product_id' => $product->id,
        'type' => 'image',
        'path' => 'sofa_old1.jpg',
        'is_primary' => true,
        'sort_order' => 1,
    ]);

    $media2 = ProductImage::create([
        'product_id' => $product->id,
        'type' => 'image',
        'path' => 'sofa_old2.jpg',
        'is_primary' => false,
        'sort_order' => 2,
    ]);

    $payload = [
        'name' => 'Luxury Lounge Sofa',
        'price' => 27000.00,
        'media' => [
            [
                'id' => $media1->id,
                'type' => 'image',
                'path' => 'sofa_updated.jpg',
                'alt_text' => 'Updated front photo',
                'sort_order' => 1,
                'is_primary' => true,
            ],
            [
                'type' => 'video',
                'path' => 'sofa_commercial.mp4',
                'mime_type' => 'video/mp4',
                'sort_order' => 3,
                'is_primary' => false,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/products/{$product->id}", $payload);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'Luxury Lounge Sofa',
            'slug' => 'luxury-lounge-sofa',
            'price' => '27000.00',
        ]);

    $this->assertDatabaseHas('product_images', [
        'id' => $media1->id,
        'path' => 'sofa_updated.jpg',
        'alt_text' => 'Updated front photo',
    ]);

    $this->assertDatabaseHas('product_images', [
        'product_id' => $product->id,
        'type' => 'video',
        'path' => 'sofa_commercial.mp4',
    ]);

    $this->assertSoftDeleted('product_images', [
        'id' => $media2->id,
    ]);
});

test('admin can soft delete product and its media', function () {
    $product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Bean Bag',
        'slug' => 'bean-bag',
        'sku' => 'MH-PRD-000001',
        'description' => 'Comfortable bean bag',
        'price' => 1200.00,
        'stock' => 15,
    ]);

    $media = ProductImage::create([
        'product_id' => $product->id,
        'type' => 'image',
        'path' => 'beanbag.jpg',
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->deleteJson("/api/admin/products/{$product->id}");
    $response->assertStatus(200);

    $this->assertSoftDeleted('products', [
        'id' => $product->id,
    ]);

    $this->assertSoftDeleted('product_images', [
        'id' => $media->id,
    ]);
});

test('products index supports category filter', function () {
    $otherCategory = Category::create(['name' => 'Lighting', 'slug' => 'lighting']);

    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Office Desk',
        'slug' => 'office-desk',
        'sku' => 'MH-PRD-000001',
        'price' => 5000.00,
        'stock' => 10,
        'description' => 'Desk'
    ]);

    Product::create([
        'category_id' => $otherCategory->id,
        'name' => 'Floor Lamp',
        'slug' => 'floor-lamp',
        'sku' => 'MH-PRD-000002',
        'price' => 2000.00,
        'stock' => 5,
        'description' => 'Lamp'
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/products?category=' . $this->category->id);
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Office Desk', $data[0]['name']);
});

test('products index supports featured filter', function () {
    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Regular Item',
        'slug' => 'regular-item',
        'sku' => 'MH-PRD-000001',
        'price' => 500.00,
        'stock' => 10,
        'featured' => false,
        'description' => 'Item'
    ]);

    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Featured Item',
        'slug' => 'featured-item',
        'sku' => 'MH-PRD-000002',
        'price' => 1500.00,
        'stock' => 5,
        'featured' => true,
        'description' => 'Item'
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/products?featured=true');
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Featured Item', $data[0]['name']);
});

test('products index supports active filter', function () {
    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Inactive Product',
        'slug' => 'inactive-product',
        'sku' => 'MH-PRD-000001',
        'price' => 100.00,
        'stock' => 10,
        'is_active' => false,
        'description' => 'Item'
    ]);

    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Active Product',
        'slug' => 'active-product',
        'sku' => 'MH-PRD-000002',
        'price' => 200.00,
        'stock' => 5,
        'is_active' => true,
        'description' => 'Item'
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/products?active=true');
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Active Product', $data[0]['name']);
});

test('products index supports search keyword', function () {
    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Leather Sofa Set',
        'slug' => 'leather-sofa-set',
        'sku' => 'MH-PRD-000001',
        'price' => 45000.00,
        'stock' => 2,
        'description' => 'A set of sofas'
    ]);

    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Wooden Bookshelf',
        'slug' => 'wooden-bookshelf',
        'sku' => 'MH-PRD-000002',
        'price' => 8000.00,
        'stock' => 4,
        'description' => 'Storage bookshelf'
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/products?search=leather');
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Leather Sofa Set', $data[0]['name']);
});

test('products index supports low stock filter', function () {
    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Sufficient Stock Product',
        'slug' => 'sufficient-stock-product',
        'sku' => 'MH-PRD-000001',
        'price' => 500.00,
        'stock' => 20,
        'low_stock_threshold' => 5,
        'description' => 'Desk'
    ]);

    Product::create([
        'category_id' => $this->category->id,
        'name' => 'Low Stock Product',
        'slug' => 'low-stock-product',
        'sku' => 'MH-PRD-000002',
        'price' => 1500.00,
        'stock' => 3,
        'low_stock_threshold' => 5,
        'description' => 'Desk'
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/products?low_stock=true');
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('Low Stock Product', $data[0]['name']);
});

test('transactions rollback completely on database or validation error during creation', function () {
    $payload = [
        'category_id' => $this->category->id,
        'name' => 'Rollback Desk',
        'description' => 'Will be rolled back',
        'price' => 2000.00,
        'stock' => 5,
        'media' => [
            [
                'type' => 'image',
                'path' => 'rollback.jpg',
                'is_primary' => true,
            ],
            [
                'id' => 9999, // Non-existent media ID or cross-product ID
                'type' => 'image',
                'path' => 'invalid.jpg',
                'is_primary' => false,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/products', $payload);

    // This should fail validation because media ID 9999 doesn't exist
    $response->assertStatus(404);

    // Assert product was NOT created in database
    $this->assertDatabaseMissing('products', [
        'name' => 'Rollback Desk',
    ]);
});
