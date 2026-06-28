<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->customer = User::factory()->create(['role' => 'customer']);
    $this->category = Category::create(['name' => 'Home', 'slug' => 'home']);
    $this->product = Product::create([
        'category_id' => $this->category->id,
        'name' => 'Lounge Chair',
        'slug' => 'lounge-chair',
        'sku' => 'MH-PRD-000001',
        'description' => 'A comfortable chair',
        'price' => 5000.00,
        'stock' => 10,
    ]);
    $this->media = ProductImage::create([
        'product_id' => $this->product->id,
        'type' => 'image',
        'path' => 'products/chair.jpg',
        'is_primary' => true,
    ]);

    // Create a base order for testing details
    $this->order = Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000001',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 5000.00,
        'shipping' => 0.00,
        'total' => 5000.00,
        'shipping_address_snapshot' => [
            'full_name' => 'Jane Doe',
            'phone' => '9876543210',
            'address_line_1' => '123 Main St',
            'city' => 'Mumbai',
            'state' => 'Maharashtra',
            'postal_code' => '400001',
            'country' => 'India',
        ],
    ]);

    $this->orderItem = OrderItem::create([
        'order_id' => $this->order->id,
        'product_id' => $this->product->id,
        'quantity' => 1,
        'price' => 5000.00,
    ]);
});

test('guest cannot access admin orders endpoints', function () {
    $this->getJson('/api/admin/orders')->assertStatus(401);
    $this->getJson("/api/admin/orders/{$this->order->id}")->assertStatus(401);
    $this->patchJson("/api/admin/orders/{$this->order->id}/status", [])->assertStatus(401);
    $this->getJson("/api/admin/orders/{$this->order->id}/history")->assertStatus(401);
});

test('customer cannot access admin orders endpoints', function () {
    $this->actingAs($this->customer, 'sanctum')->getJson('/api/admin/orders')->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->getJson("/api/admin/orders/{$this->order->id}")->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [])->assertStatus(403);
    $this->actingAs($this->customer, 'sanctum')->getJson("/api/admin/orders/{$this->order->id}/history")->assertStatus(403);
});

test('admin can access orders list and get details', function () {
    $responseList = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/orders');
    $responseList->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'order_number',
                    'status',
                    'payment_status',
                    'subtotal',
                    'shipping',
                    'total',
                    'created_at',
                    'customer'
                ]
            ]
        ]);

    $responseDetails = $this->actingAs($this->admin, 'sanctum')->getJson("/api/admin/orders/{$this->order->id}");
    $responseDetails->assertStatus(200)
        ->assertJsonFragment([
            'id' => $this->order->id,
            'order_number' => 'MH-2026-000001',
            'status' => 'Pending',
        ])
        ->assertJsonStructure([
            'data' => [
                'customer' => ['id', 'name', 'email'],
                'shipping_address_snapshot' => ['full_name', 'phone', 'address_line_1'],
                'order_items' => [
                    '*' => [
                        'id',
                        'product_id',
                        'quantity',
                        'price',
                        'product' => [
                            'id',
                            'name',
                            'slug',
                            'brand',
                            'media'
                        ]
                    ]
                ],
                'history'
            ]
        ]);
});

test('orders list can be filtered by status', function () {
    $processingOrder = Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000002',
        'status' => 'Processing',
        'payment_status' => 'Pending',
        'subtotal' => 100.00,
        'shipping' => 99.00,
        'total' => 199.00,
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/orders?status=processing');
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('MH-2026-000002', $data[0]['order_number']);
});

test('orders list can be filtered by payment status', function () {
    $paidOrder = Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000002',
        'status' => 'Pending',
        'payment_status' => 'Paid',
        'subtotal' => 100.00,
        'shipping' => 99.00,
        'total' => 199.00,
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/orders?payment_status=paid');
    $response->assertStatus(200);
    $data = $response->json('data');
    $this->assertCount(1, $data);
    $this->assertEquals('MH-2026-000002', $data[0]['order_number']);
});

test('orders list can be filtered by search keyword', function () {
    $otherCustomer = User::factory()->create(['name' => 'Zack Snyder', 'email' => 'zack@example.com']);
    $otherOrder = Order::create([
        'user_id' => $otherCustomer->id,
        'order_number' => 'MH-2026-999999',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 100.00,
        'shipping' => 99.00,
        'total' => 199.00,
    ]);

    // Search by order number
    $responseNumber = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/orders?search=999999');
    $responseNumber->assertStatus(200);
    $this->assertCount(1, $responseNumber->json('data'));

    // Search by customer name
    $responseName = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/orders?search=Zack');
    $responseName->assertStatus(200);
    $this->assertCount(1, $responseName->json('data'));
});

test('orders list can be filtered by date range', function () {
    $oldOrder = Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000002',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 100.00,
        'shipping' => 99.00,
        'total' => 199.00,
    ]);
    $oldOrder->created_at = now()->subDays(5);
    $oldOrder->save();

    $newOrder = Order::create([
        'user_id' => $this->customer->id,
        'order_number' => 'MH-2026-000003',
        'status' => 'Pending',
        'payment_status' => 'Pending',
        'subtotal' => 100.00,
        'shipping' => 99.00,
        'total' => 199.00,
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/orders?date_from=' . now()->subDays(2)->format('Y-m-d'));
    $response->assertStatus(200);
    
    // Should include $this->order and $newOrder, but exclude $oldOrder
    $data = $response->json('data');
    $orderNumbers = collect($data)->pluck('order_number');
    $this->assertTrue($orderNumbers->contains($newOrder->order_number));
    $this->assertFalse($orderNumbers->contains($oldOrder->order_number));
});

test('allowed status changes succeed and log history', function () {
    // 1. Pending -> Processing (Allowed)
    $response1 = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [
        'status' => 'processing',
        'remarks' => 'Preparing items for packing',
    ]);
    $response1->assertStatus(200)
        ->assertJsonFragment(['status' => 'Processing']);

    $this->assertDatabaseHas('orders', [
        'id' => $this->order->id,
        'status' => 'Processing',
    ]);

    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $this->order->id,
        'old_status' => 'Pending',
        'new_status' => 'Processing',
        'changed_by' => $this->admin->id,
        'remarks' => 'Preparing items for packing',
    ]);

    // 2. Processing -> Packed (Allowed)
    $response2 = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [
        'status' => 'Packed',
    ]);
    $response2->assertStatus(200)
        ->assertJsonFragment(['status' => 'Packed']);

    // 3. Packed -> Shipped (Allowed)
    $response3 = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [
        'status' => 'shipped',
    ]);
    $response3->assertStatus(200)
        ->assertJsonFragment(['status' => 'Shipped']);

    // 4. Shipped -> Delivered (Allowed)
    $response4 = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [
        'status' => 'delivered',
    ]);
    $response4->assertStatus(200)
        ->assertJsonFragment(['status' => 'Delivered']);
});

test('rejected status changes fail and rollback', function () {
    // Pending -> Delivered (Not Allowed)
    $response = $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [
        'status' => 'delivered',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['status']);

    // Order status should remain 'Pending'
    $this->assertEquals('Pending', $this->order->fresh()->status);

    // No status history should be logged
    $this->assertDatabaseMissing('order_status_histories', [
        'order_id' => $this->order->id,
    ]);
});

test('admin can view history log for an order', function () {
    // Make an allowed status transition
    $this->actingAs($this->admin, 'sanctum')->patchJson("/api/admin/orders/{$this->order->id}/status", [
        'status' => 'processing',
        'remarks' => 'First transition',
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson("/api/admin/orders/{$this->order->id}/history");
    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'old_status',
                    'new_status',
                    'remarks',
                    'changed_by' => ['id', 'name', 'email'],
                    'created_at'
                ]
            ]
        ])
        ->assertJsonFragment([
            'old_status' => 'Pending',
            'new_status' => 'Processing',
            'remarks' => 'First transition',
        ]);
});
