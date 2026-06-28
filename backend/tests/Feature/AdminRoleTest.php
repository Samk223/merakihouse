<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('newly created user has default role as customer', function () {
    $user = User::factory()->create();
    $user->refresh();

    $this->assertEquals('customer', $user->role);
    $this->assertTrue($user->isCustomer());
    $this->assertFalse($user->isAdmin());
});

test('helpers isAdmin and isCustomer work correctly', function () {
    $customer = User::factory()->create(['role' => 'customer']);
    $admin = User::factory()->create(['role' => 'admin']);

    $this->assertTrue($customer->isCustomer());
    $this->assertFalse($customer->isAdmin());

    $this->assertTrue($admin->isAdmin());
    $this->assertFalse($admin->isCustomer());
});

test('guest cannot access admin routes', function () {
    $response = $this->getJson('/api/admin/dashboard');

    $response->assertStatus(401);
});

test('customer cannot access admin routes', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $response = $this->actingAs($customer, 'sanctum')->getJson('/api/admin/dashboard');

    $response->assertStatus(403)
        ->assertJson([
            'success' => false,
            'message' => 'This action is unauthorized. Admin access required.',
        ]);
});

test('admin can access protected admin routes', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin, 'sanctum')->getJson('/api/admin/dashboard');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'total_products',
            'total_categories',
            'total_customers',
            'total_orders',
            'pending_orders',
            'delivered_orders',
            'total_reviews',
            'average_rating',
            'currency',
        ]);
});

test('existing authentication flow remains unchanged', function () {
    // 1. Register a new user
    $registerData = [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ];

    $responseRegister = $this->postJson('/api/register', $registerData);
    $responseRegister->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email'],
                'token'
            ]
        ]);

    // Verify user role in database
    $user = User::where('email', 'jane@example.com')->first();
    $this->assertNotNull($user);
    $this->assertEquals('customer', $user->role);

    // 2. Login
    $loginData = [
        'email' => 'jane@example.com',
        'password' => 'Password123!',
    ];

    $responseLogin = $this->postJson('/api/login', $loginData);
    $responseLogin->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email'],
                'token'
            ]
        ]);

    // 3. Get profile
    $token = $responseLogin->json('data.token');
    $responseProfile = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->getJson('/api/profile');

    $responseProfile->assertStatus(200)
        ->assertJsonFragment([
            'email' => 'jane@example.com',
        ]);

    // 4. Logout
    $responseLogout = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/logout');

    $responseLogout->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
});
