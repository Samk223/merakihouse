<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->customer = User::factory()->create(['role' => 'customer']);
});

test('guest cannot access admin dashboard statistics', function () {
    $response = $this->getJson('/api/admin/dashboard');
    $response->assertStatus(401);
});

test('customer cannot access admin dashboard statistics', function () {
    $response = $this->actingAs($this->customer, 'sanctum')->getJson('/api/admin/dashboard');
    $response->assertStatus(403);
});

test('admin can access admin dashboard statistics', function () {
    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/dashboard');
    $response->assertStatus(200);
});

test('dashboard stats calculates aggregates correctly', function () {
    // 1. Create Categories
    $cat1 = Category::create(['name' => 'Bedroom', 'slug' => 'bedroom']);
    $cat2 = Category::create(['name' => 'Living Room', 'slug' => 'living-room']);

    // 2. Create Products
    $prod1 = Product::create([
        'category_id' => $cat1->id,
        'name' => 'Premium Bedsheet',
        'slug' => 'premium-bedsheet',
        'sku' => 'BED-001',
        'price' => 750.00,
        'stock' => 10,
    ]);

    $prod2 = Product::create([
        'category_id' => $cat2->id,
        'name' => 'Sofa Chair',
        'slug' => 'sofa-chair',
        'sku' => 'SOF-002',
        'price' => 12000.00,
        'stock' => 5,
    ]);

    // 3. Create Customers (Already have $this->customer)
    $customer2 = User::factory()->create(['role' => 'customer']);
    
    // Create an Admin to verify admins are excluded from customer count
    User::factory()->create(['role' => 'admin']);

    // 4. Create Orders with statuses
    // Order 1: Pending
    Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000001',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 750.00,
        'shipping' => 99.00,
        'total' => 849.00,
        'shipping_address_snapshot' => ['full_name' => 'Rajesh Kumar'],
    ]);

    // Order 2: Delivered
    Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000002',
        'status' => 'Delivered',
        'payment_status' => 'Paid',
        'subtotal' => 12000.00,
        'shipping' => 0.00,
        'total' => 12000.00,
        'shipping_address_snapshot' => ['full_name' => 'Rajesh Kumar'],
    ]);

    // Order 3: Cancelled (to test total orders and status filtering)
    Order::create([
        'user_id' => $customer2->id,
        'order_number' => 'MH-2026-000003',
        'status' => 'Cancelled',
        'payment_status' => 'Unpaid',
        'subtotal' => 12000.00,
        'shipping' => 0.00,
        'total' => 12000.00,
        'shipping_address_snapshot' => ['full_name' => 'Amit Shah'],
    ]);

    // 5. Create Reviews with ratings (4 and 5)
    Review::create([
        'user_id' => $this->customer->id,
        'product_id' => $prod1->id,
        'rating' => 4,
        'comment' => 'Very nice fabric.',
    ]);

    Review::create([
        'user_id' => $customer2->id,
        'product_id' => $prod2->id,
        'rating' => 5,
        'comment' => 'Incredible sofa.',
    ]);

    // Fetch dashboard
    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/dashboard');

    $response->assertStatus(200)
        ->assertJson([
            'total_products' => 2,
            'total_categories' => 2,
            'total_customers' => 2, // $this->customer and $customer2
            'total_orders' => 3,
            'pending_orders' => 1,
            'delivered_orders' => 1,
            'total_reviews' => 2,
            'average_rating' => 4.5,
            'currency' => 'INR', // from config('commerce.currency') default in testing
        ]);
});

test('dashboard stats respects configured currency', function () {
    Config::set('commerce.currency', 'USD');

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/dashboard');

    $response->assertStatus(200)
        ->assertJsonFragment([
            'currency' => 'USD',
        ]);
});
