<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can register with valid data', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email', 'created_at'],
                'token',
                'token_type',
            ]
        ]);

    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
    ]);
});

test('registration validation errors', function () {
    $response = $this->postJson('/api/register', [
        'name' => '',
        'email' => 'invalid-email',
        'password' => '123',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'email', 'password']);
});

test('user can login with correct credentials', function () {
    $user = User::factory()->create([
        'email' => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'login@example.com',
        'password' => 'password123',
    ]);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'success',
            'message',
            'data' => [
                'user' => ['id', 'name', 'email'],
                'token',
            ]
        ]);
});

test('login fails with incorrect credentials', function () {
    $user = User::factory()->create([
        'email' => 'login@example.com',
        'password' => bcrypt('password123'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => 'login@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'success' => false,
            'message' => 'Invalid email or password.',
        ]);
});

test('authenticated user can view profile', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')->getJson('/api/profile');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Profile retrieved successfully.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ]
            ]
        ]);
});

test('unauthenticated user cannot view profile', function () {
    $response = $this->getJson('/api/profile');

    $response->assertStatus(401);
});

test('authenticated user can logout', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test_token')->plainTextToken;

    $response = $this->withHeader('Authorization', 'Bearer ' . $token)
        ->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);

    $this->assertCount(0, $user->tokens);
});
