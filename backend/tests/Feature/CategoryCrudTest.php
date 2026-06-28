<?php

use App\Models\Category;
use App\Models\CategoryMedia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->customer = User::factory()->create(['role' => 'customer']);
});

test('guest cannot access admin categories CRUD', function () {
    $this->getJson('/api/admin/categories')->assertStatus(401);
    $this->postJson('/api/admin/categories', [])->assertStatus(401);
    $this->patchJson('/api/admin/categories/1', [])->assertStatus(401);
    $this->deleteJson('/api/admin/categories/1')->assertStatus(401);
});

test('customer cannot access admin categories CRUD', function () {
    $category = Category::create([
        'name' => 'Dummy Category',
        'slug' => 'dummy-category',
    ]);

    $this->actingAs($this->customer, 'sanctum')->getJson('/api/admin/categories')->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->postJson('/api/admin/categories', [])->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->patchJson("/api/admin/categories/{$category->id}", [])->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->deleteJson("/api/admin/categories/{$category->id}")->assertStatus(403);
});

test('admin can access categories list and get details', function () {
    $category = Category::create([
        'name' => 'Kitchen',
        'slug' => 'kitchen',
        'display_order' => 1,
    ]);

    $responseList = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/categories');
    $responseList->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'slug', 'display_order', 'is_active', 'media']
            ],
            'links',
            'meta',
        ]);

    $responseDetails = $this->actingAs($this->admin, 'sanctum')->getJson("/api/admin/categories/{$category->id}");
    $responseDetails->assertStatus(200)
        ->assertJsonFragment([
            'id' => $category->id,
            'name' => 'Kitchen',
            'slug' => 'kitchen',
        ]);
});

test('admin can create category with media and auto-generated slug', function () {
    $payload = [
        'name' => 'Living Room Furniture',
        'description' => 'Chairs, Sofas, Coffee Tables',
        'display_order' => 5,
        'is_active' => true,
        'media' => [
            [
                'type' => 'image',
                'path' => 'categories/living_sofa.jpg',
                'mime_type' => 'image/jpeg',
                'alt_text' => 'Comfy sofa banner',
                'sort_order' => 0,
                'is_primary' => true,
            ],
            [
                'type' => 'video',
                'path' => 'categories/living_tour.mp4',
                'mime_type' => 'video/mp4',
                'alt_text' => 'Intro tour video',
                'sort_order' => 1,
                'is_primary' => false,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/categories', $payload);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'name' => 'Living Room Furniture',
            'slug' => 'living-room-furniture',
            'display_order' => 5,
        ]);

    $this->assertDatabaseHas('categories', [
        'name' => 'Living Room Furniture',
        'slug' => 'living-room-furniture',
    ]);

    $this->assertDatabaseHas('category_media', [
        'type' => 'image',
        'path' => 'categories/living_sofa.jpg',
        'is_primary' => true,
    ]);

    $this->assertDatabaseHas('category_media', [
        'type' => 'video',
        'path' => 'categories/living_tour.mp4',
        'is_primary' => false,
    ]);
});

test('uniqueness collision auto-increments generated slug suffix', function () {
    // 1. Create first category
    Category::create([
        'name' => 'Outdoor',
        'slug' => 'outdoor',
    ]);

    // 2. Submit second category with same name
    $payload = ['name' => 'Outdoor'];
    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/categories', $payload);
    $response->assertStatus(201)
        ->assertJsonFragment(['slug' => 'outdoor-2']);

    // 3. Submit third category with same name
    $responseThird = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/categories', $payload);
    $responseThird->assertStatus(201)
        ->assertJsonFragment(['slug' => 'outdoor-3']);
});

test('creation fails if multiple primary media are specified', function () {
    $payload = [
        'name' => 'Bad Media Category',
        'media' => [
            [
                'type' => 'image',
                'path' => 'media1.jpg',
                'is_primary' => true,
            ],
            [
                'type' => 'image',
                'path' => 'media2.jpg',
                'is_primary' => true,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->postJson('/api/admin/categories', $payload);
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['media']);
});

test('admin can update category details and sync media', function () {
    // 1. Create a category with initial media
    $category = Category::create([
        'name' => 'Dining Room',
        'slug' => 'dining-room',
        'display_order' => 10,
    ]);

    $media1 = CategoryMedia::create([
        'category_id' => $category->id,
        'type' => 'image',
        'path' => 'dining_banner.jpg',
        'is_primary' => true,
        'sort_order' => 0,
    ]);

    $media2 = CategoryMedia::create([
        'category_id' => $category->id,
        'type' => 'image',
        'path' => 'dining_detail.jpg',
        'is_primary' => false,
        'sort_order' => 1,
    ]);

    // 2. Send update payload to:
    // - Update category name (should re-generate unique slug)
    // - Update $media1 attributes (path, alt_text)
    // - Add a new media ($media3)
    // - Omit $media2 (should be soft-deleted)
    $payload = [
        'name' => 'Fine Dining',
        'display_order' => 12,
        'media' => [
            [
                'id' => $media1->id,
                'type' => 'image',
                'path' => 'dining_banner_new.jpg',
                'alt_text' => 'New Banner Alt',
                'sort_order' => 0,
                'is_primary' => true,
            ],
            [
                'type' => 'video',
                'path' => 'dining_video.mp4',
                'mime_type' => 'video/mp4',
                'sort_order' => 2,
                'is_primary' => false,
            ]
        ]
    ];

    $response = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/categories/{$category->id}", $payload);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'name' => 'Fine Dining',
            'slug' => 'fine-dining',
            'display_order' => 12,
        ]);

    // Check media updates
    $this->assertDatabaseHas('category_media', [
        'id' => $media1->id,
        'path' => 'dining_banner_new.jpg',
        'alt_text' => 'New Banner Alt',
    ]);

    // Check new media creation
    $this->assertDatabaseHas('category_media', [
        'category_id' => $category->id,
        'type' => 'video',
        'path' => 'dining_video.mp4',
    ]);

    // Check omitted media is soft-deleted (present in DB with non-null deleted_at, missing from normal query)
    $this->assertSoftDeleted('category_media', [
        'id' => $media2->id,
    ]);
});

test('admin can soft delete category and its associated media', function () {
    $category = Category::create([
        'name' => 'Office Furniture',
        'slug' => 'office-furniture',
    ]);

    $media = CategoryMedia::create([
        'category_id' => $category->id,
        'type' => 'image',
        'path' => 'office.jpg',
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->deleteJson("/api/admin/categories/{$category->id}");
    $response->assertStatus(200);

    // Verify category and media are soft deleted in database
    $this->assertSoftDeleted('categories', [
        'id' => $category->id,
    ]);

    $this->assertSoftDeleted('category_media', [
        'id' => $media->id,
    ]);
});

test('categories index sorts categories by display_order then by name', function () {
    Category::create(['name' => 'Zebra Rugs', 'slug' => 'zebra-rugs', 'display_order' => 5]);
    Category::create(['name' => 'Antique Vases', 'slug' => 'antique-vases', 'display_order' => 5]);
    Category::create(['name' => 'Bedroom Lights', 'slug' => 'bedroom-lights', 'display_order' => 1]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/categories');

    // BedRoom Lights (order 1) should be first, then Antique Vases (order 5), then Zebra Rugs (order 5)
    $data = $response->json('data');
    $this->assertCount(3, $data);
    $this->assertEquals('Bedroom Lights', $data[0]['name']);
    $this->assertEquals('Antique Vases', $data[1]['name']);
    $this->assertEquals('Zebra Rugs', $data[2]['name']);
});
