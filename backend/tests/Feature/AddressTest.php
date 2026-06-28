<?php

use App\Models\Address;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->otherUser = User::factory()->create();
});

test('guest cannot access address endpoints', function () {
    $this->getJson('/api/addresses')->assertStatus(401);
    $this->postJson('/api/addresses', [])->assertStatus(401);
    $this->patchJson('/api/addresses/1', [])->assertStatus(401);
    $this->deleteJson('/api/addresses/1')->assertStatus(401);
    $this->patchJson('/api/addresses/1/default')->assertStatus(401);
});

test('user can create an address and first address automatically becomes default', function () {
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh Kumar',
        'phone' => '9876543210',
        'address_line_1' => 'Flat 401, Sapphire Apartments',
        'address_line_2' => 'Indiranagar',
        'city' => 'Bengaluru',
        'state' => 'Karnataka',
        'postal_code' => '560038',
    ]);

    $response->assertStatus(201)
        ->assertJson([
            'success' => true,
            'message' => 'Address created successfully.',
            'data' => [
                'full_name' => 'Rajesh Kumar',
                'is_default' => true,
                'country' => 'India', // default country assignment
            ]
        ]);

    $this->assertDatabaseHas('addresses', [
        'user_id' => $this->user->id,
        'postal_code' => '560038',
        'is_default' => true,
    ]);
});

test('subsequent addresses are not default unless specified', function () {
    // First address (default)
    Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'First Address',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'country' => 'India',
        'postal_code' => '110001',
        'is_default' => true,
    ]);

    // Second address (not default)
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Second Address',
        'phone' => '9876543210',
        'address_line_1' => 'Line 2',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
        'is_default' => false,
    ]);

    $response->assertStatus(201)
        ->assertJsonPath('data.is_default', false);

    $this->assertEquals(2, Address::where('user_id', $this->user->id)->count());
    $this->assertEquals(1, Address::where('user_id', $this->user->id)->where('is_default', true)->count());
});

test('user can update their own address', function () {
    $address = Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'Original Name',
        'phone' => '9876543210',
        'address_line_1' => 'Original Line 1',
        'city' => 'Original City',
        'state' => 'Karnataka',
        'country' => 'India',
        'postal_code' => '560038',
        'is_default' => true,
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/addresses/{$address->id}", [
        'full_name' => 'Updated Name',
        'phone' => '919876543210', // valid Indian number with country code
        'address_line_1' => 'Updated Line 1',
        'city' => 'Updated City',
        'state' => 'Karnataka',
        'postal_code' => '560001', // updated PIN code
    ]);

    $response->assertStatus(200)
        ->assertJsonPath('data.full_name', 'Updated Name')
        ->assertJsonPath('data.phone', '919876543210')
        ->assertJsonPath('data.postal_code', '560001');

    $this->assertDatabaseHas('addresses', [
        'id' => $address->id,
        'full_name' => 'Updated Name',
    ]);
});

test('user cannot update another users address', function () {
    $address = Address::create([
        'user_id' => $this->otherUser->id,
        'full_name' => 'Other User',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'country' => 'India',
        'postal_code' => '110001',
    ]);

    $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/addresses/{$address->id}", [
        'full_name' => 'Hacker Name',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
    ]);

    $response->assertStatus(403);
});

test('user can delete their own address and deleting default promotes oldest remaining', function () {
    // Create first address (oldest)
    $address1 = Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'First Address (Default)',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'country' => 'India',
        'postal_code' => '110001',
        'is_default' => true,
    ]);

    // Create second address
    $address2 = Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'Second Address',
        'phone' => '9876543210',
        'address_line_1' => 'Line 2',
        'city' => 'City',
        'state' => 'State',
        'country' => 'India',
        'postal_code' => '110001',
        'is_default' => false,
    ]);

    // Delete the default address
    $response = $this->actingAs($this->user, 'sanctum')->deleteJson("/api/addresses/{$address1->id}");

    $response->assertStatus(200);

    // Verify oldest remaining (address2) is promoted as default
    $address2->refresh();
    $this->assertTrue($address2->is_default);
});

test('user can change default address and only one default address exists', function () {
    $address1 = Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'First Address',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'country' => 'India',
        'postal_code' => '110001',
        'is_default' => true,
    ]);

    $address2 = Address::create([
        'user_id' => $this->user->id,
        'full_name' => 'Second Address',
        'phone' => '9876543210',
        'address_line_1' => 'Line 2',
        'city' => 'City',
        'state' => 'State',
        'country' => 'India',
        'postal_code' => '110001',
        'is_default' => false,
    ]);

    // Set second address as default
    $response = $this->actingAs($this->user, 'sanctum')->patchJson("/api/addresses/{$address2->id}/default");

    $response->assertStatus(200);

    $address1->refresh();
    $address2->refresh();

    // Verify address2 is default and address1 has been demoted
    $this->assertTrue($address2->is_default);
    $this->assertFalse($address1->is_default);
    $this->assertEquals(1, Address::where('user_id', $this->user->id)->where('is_default', true)->count());
});

test('indian phone validation constraints', function () {
    // 1. Invalid phone number (must start with 6-9)
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh',
        'phone' => '1234567890', // starts with 1
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
    ]);
    $response->assertStatus(422)->assertJsonValidationErrors(['phone']);

    // 2. Invalid length (less than 10 digits)
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh',
        'phone' => '98765432',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
    ]);
    $response->assertStatus(422)->assertJsonValidationErrors(['phone']);

    // 3. Valid standard number
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
    ]);
    $response->assertStatus(201);
});

test('indian PIN code validation constraints', function () {
    // 1. Invalid PIN code (starts with 0)
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '012345',
    ]);
    $response->assertStatus(422)->assertJsonValidationErrors(['postal_code']);

    // 2. Invalid length (5 digits)
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '11000',
    ]);
    $response->assertStatus(422)->assertJsonValidationErrors(['postal_code']);

    // 3. Valid PIN code
    $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/addresses', [
        'full_name' => 'Rajesh',
        'phone' => '9876543210',
        'address_line_1' => 'Line 1',
        'city' => 'City',
        'state' => 'State',
        'postal_code' => '110001',
    ]);
    $response->assertStatus(201);
});
