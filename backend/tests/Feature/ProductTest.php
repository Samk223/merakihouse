<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Create categories
    $this->cat1 = Category::create([
        'name' => 'Living Room',
        'slug' => 'living-room',
    ]);

    $this->cat2 = Category::create([
        'name' => 'Kitchen',
        'slug' => 'kitchen',
    ]);

    // Create products
    $this->product1 = Product::create([
        'category_id' => $this->cat1->id,
        'name' => 'Luxury Velvet Sofa',
        'slug' => 'luxury-velvet-sofa',
        'sku' => 'SOFA-001',
        'short_description' => 'A luxury velvet sofa.',
        'description' => 'Beautiful deep blue luxury velvet sofa for living room decor.',
        'price' => 1500.00,
        'is_active' => true,
    ]);

    $this->product2 = Product::create([
        'category_id' => $this->cat2->id,
        'name' => 'Ceramic Mug Set',
        'slug' => 'ceramic-mug-set',
        'sku' => 'MUG-002',
        'short_description' => 'Handmade kitchen mug set.',
        'description' => 'Minimalist white ceramic mugs for coffee or tea.',
        'price' => 45.00,
        'is_active' => true,
    ]);

    $this->inactiveProduct = Product::create([
        'category_id' => $this->cat1->id,
        'name' => 'Old Wooden Table',
        'slug' => 'old-wooden-table',
        'sku' => 'TABLE-003',
        'price' => 200.00,
        'is_active' => false,
    ]);

    // Add images
    ProductImage::create([
        'product_id' => $this->product1->id,
        'image_url' => 'https://example.com/sofa.jpg',
        'alt_text' => 'Luxury Sofa',
        'is_primary' => true,
    ]);
});

test('user can fetch paginated products with category and images', function () {
    $response = $this->getJson('/api/products');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'current_page',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'price',
                        'category' => [
                            'id',
                            'name',
                            'slug',
                        ],
                        'images' => [
                            '*' => [
                                'id',
                                'image_url',
                                'is_primary',
                            ],
                        ],
                    ],
                ],
                'first_page_url',
                'from',
                'last_page',
                'last_page_url',
                'links',
                'next_page_url',
                'path',
                'per_page',
                'prev_page_url',
                'to',
                'total',
            ],
        ]);

    // Check inactive products are excluded
    $data = $response->json('data.data');
    $this->assertCount(2, $data);
    $slugs = collect($data)->pluck('slug')->all();
    $this->assertContains('luxury-velvet-sofa', $slugs);
    $this->assertContains('ceramic-mug-set', $slugs);
    $this->assertNotContains('old-wooden-table', $slugs);
});

test('user can fetch single product details by slug', function () {
    $response = $this->getJson('/api/products/luxury-velvet-sofa');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Product retrieved successfully.',
            'data' => [
                'slug' => 'luxury-velvet-sofa',
                'name' => 'Luxury Velvet Sofa',
                'category' => [
                    'name' => 'Living Room',
                ],
            ],
        ]);

    $this->assertCount(1, $response->json('data.images'));
});

test('fetching non-existent product slug returns 404', function () {
    $response = $this->getJson('/api/products/non-existent-slug');

    $response->assertStatus(404)
        ->assertJson([
            'success' => false,
            'message' => 'Product not found.',
        ]);
});

test('user can search products by keyword', function () {
    $response = $this->getJson('/api/products?search=velvet');

    $response->assertStatus(200);
    $data = $response->json('data.data');
    $this->assertCount(1, $data);
    $this->assertEquals('luxury-velvet-sofa', $data[0]['slug']);
});

test('user can filter products by category', function () {
    $response = $this->getJson('/api/products?category=kitchen');

    $response->assertStatus(200);
    $data = $response->json('data.data');
    $this->assertCount(1, $data);
    $this->assertEquals('ceramic-mug-set', $data[0]['slug']);
});

test('user can filter products by price range', function () {
    // Test min price
    $response = $this->getJson('/api/products?min_price=100');
    $response->assertStatus(200);
    $data = $response->json('data.data');
    $this->assertCount(1, $data);
    $this->assertEquals('luxury-velvet-sofa', $data[0]['slug']);

    // Test max price
    $response = $this->getJson('/api/products?max_price=100');
    $response->assertStatus(200);
    $data = $response->json('data.data');
    $this->assertCount(1, $data);
    $this->assertEquals('ceramic-mug-set', $data[0]['slug']);

    // Test combined range
    $response = $this->getJson('/api/products?min_price=30&max_price=1600');
    $response->assertStatus(200);
    $data = $response->json('data.data');
    $this->assertCount(2, $data);
});

test('user can configure pagination per page', function () {
    $response = $this->getJson('/api/products?per_page=1');

    $response->assertStatus(200);
    $this->assertEquals(1, $response->json('data.per_page'));
    $this->assertEquals(2, $response->json('data.total'));
});
