<?php

use App\Models\Category;
use App\Models\CategoryMedia;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->category = Category::create([
        'name' => 'Home & Living',
        'slug' => 'home-living',
    ]);

    $this->product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Modern Table',
        'slug' => 'modern-table',
        'sku' => 'TAB-002',
        'price' => 3500.00,
        'stock' => 10,
    ]);
});

test('upgraded product image supports new attributes and backward compatibility', function () {
    // 1. Create a ProductImage with new fields (path, type, mime_type)
    $image = ProductImage::create([
        'product_id' => $this->product->id,
        'path' => 'products/images/table.jpg',
        'type' => 'image',
        'mime_type' => 'image/jpeg',
        'alt_text' => 'Side View',
        'sort_order' => 1,
        'is_primary' => true,
    ]);

    $this->assertEquals('products/images/table.jpg', $image->path);
    $this->assertEquals('image', $image->type);
    $this->assertEquals('image/jpeg', $image->mime_type);
    $this->assertEquals('products/images/table.jpg', $image->image_url); // Accessor test

    // 2. Create using image_url (backward compatibility mutator)
    $imageLegacy = ProductImage::create([
        'product_id' => $this->product->id,
        'image_url' => 'products/images/table_legacy.jpg',
        'alt_text' => 'Legacy View',
    ]);

    $this->assertEquals('products/images/table_legacy.jpg', $imageLegacy->path);
    $this->assertEquals('products/images/table_legacy.jpg', $imageLegacy->image_url);
    $this->assertEquals('image', $imageLegacy->type); // default value
});

test('category media relationship and attributes work correctly', function () {
    // 1. Create category media
    $media1 = CategoryMedia::create([
        'category_id' => $this->category->id,
        'type' => 'image',
        'path' => 'categories/banners/living.jpg',
        'mime_type' => 'image/jpeg',
        'alt_text' => 'Living Room Banner',
        'sort_order' => 0,
        'is_primary' => true,
    ]);

    $media2 = CategoryMedia::create([
        'category_id' => $this->category->id,
        'type' => 'video',
        'path' => 'categories/videos/intro.mp4',
        'mime_type' => 'video/mp4',
        'alt_text' => 'Category Walkthrough Video',
        'sort_order' => 1,
        'is_primary' => false,
    ]);

    // 2. Fetch category and eager load media relationship
    $categoryWithMedia = Category::with('media')->find($this->category->id);

    $this->assertCount(2, $categoryWithMedia->media);
    
    $firstMedia = $categoryWithMedia->media->firstWhere('type', 'image');
    $this->assertEquals('categories/banners/living.jpg', $firstMedia->path);
    $this->assertTrue($firstMedia->is_primary);

    $secondMedia = $categoryWithMedia->media->firstWhere('type', 'video');
    $this->assertEquals('categories/videos/intro.mp4', $secondMedia->path);
    $this->assertFalse($secondMedia->is_primary);
    $this->assertEquals('video/mp4', $secondMedia->mime_type);
});
