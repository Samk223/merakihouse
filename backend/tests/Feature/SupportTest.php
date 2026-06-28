<?php

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $this->customer = User::factory()->create(['role' => 'customer']);
    $this->otherCustomer = User::factory()->create(['role' => 'customer']);
});

// CUSTOMER SUPPORT TICKET TESTS

test('guest cannot access customer support endpoints', function () {
    $this->getJson('/api/support/tickets')->assertStatus(401);
    $this->postJson('/api/support/tickets', [])->assertStatus(401);
    $this->getJson('/api/support/tickets/1')->assertStatus(401);
    $this->postJson('/api/support/tickets/1/reply', [])->assertStatus(401);
});

test('customer can create ticket with first message and auto-generated number', function () {
    $payload = [
        'subject' => 'Billing issue on order #1234',
        'category' => 'Billing',
        'priority' => 'high',
        'message' => 'I was charged twice for this transaction.',
    ];

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson('/api/support/tickets', $payload);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'subject' => 'Billing issue on order #1234',
            'category' => 'Billing',
            'priority' => 'high',
            'status' => 'open',
            'ticket_number' => 'MH-TKT-000001',
        ]);

    $this->assertDatabaseHas('support_tickets', [
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Billing issue on order #1234',
    ]);

    $this->assertDatabaseHas('support_messages', [
        'message' => 'I was charged twice for this transaction.',
        'is_admin' => false,
    ]);
});

test('customer can view own tickets and details with conversation history', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Broken item',
        'category' => 'Delivery',
        'priority' => 'medium',
        'status' => 'open',
    ]);

    $message = SupportMessage::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->customer->id,
        'message' => 'The item arrived shattered.',
        'is_admin' => false,
    ]);

    // View own tickets list
    $responseList = $this->actingAs($this->customer, 'sanctum')->getJson('/api/support/tickets');
    $responseList->assertStatus(200)
        ->assertJsonStructure(['data' => [['id', 'ticket_number', 'subject', 'status']]]);

    // View details
    $responseDetails = $this->actingAs($this->customer, 'sanctum')->getJson("/api/support/tickets/{$ticket->id}");
    $responseDetails->assertStatus(200)
        ->assertJsonFragment([
            'id' => $ticket->id,
            'ticket_number' => 'MH-TKT-000001',
        ])
        ->assertJsonStructure([
            'data' => [
                'conversation' => [
                    '*' => ['id', 'message', 'is_admin']
                ]
            ]
        ]);
});

test('customer cannot view or reply to other customers tickets', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->otherCustomer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Private ticket',
        'category' => 'Privacy',
        'priority' => 'low',
        'status' => 'open',
    ]);

    // View detail other ticket should return 403
    $this->actingAs($this->customer, 'sanctum')
        ->getJson("/api/support/tickets/{$ticket->id}")
        ->assertStatus(403);

    // Reply to other ticket should return 403
    $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", ['message' => 'Hey'])
        ->assertStatus(403);
});

test('customer can reply to own open ticket', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", ['message' => 'Still waiting...']);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'message' => 'Still waiting...',
            'is_admin' => false,
        ]);

    $this->assertDatabaseHas('support_messages', [
        'ticket_id' => $ticket->id,
        'message' => 'Still waiting...',
        'is_admin' => false,
    ]);
});

test('customer cannot reply to closed ticket', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'closed',
    ]);

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", ['message' => 'Reopen please']);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['ticket']);
});

// ADMIN SUPPORT TICKET TESTS

test('guest and customer cannot access admin support endpoints', function () {
    $this->getJson('/api/admin/support/tickets')->assertStatus(401);
    $this->actingAs($this->customer, 'sanctum')->getJson('/api/admin/support/tickets')->assertStatus(403);
});

test('admin can view list of all tickets and apply filters', function () {
    // Ticket 1: open, billing, high
    $ticket1 = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Open Billing Ticket',
        'category' => 'Billing',
        'priority' => 'high',
        'status' => 'open',
    ]);

    // Ticket 2: closed, delivery, low
    $ticket2 = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000002',
        'subject' => 'Closed Delivery Ticket',
        'category' => 'Delivery',
        'priority' => 'low',
        'status' => 'closed',
    ]);

    // Filter by status
    $responseStatus = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/support/tickets?status=open');
    $responseStatus->assertStatus(200);
    $this->assertCount(1, $responseStatus->json('data'));
    $this->assertEquals('MH-TKT-000001', $responseStatus->json('data.0.ticket_number'));

    // Filter by category
    $responseCategory = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/support/tickets?category=delivery');
    $responseCategory->assertStatus(200);
    $this->assertCount(1, $responseCategory->json('data'));
    $this->assertEquals('MH-TKT-000002', $responseCategory->json('data.0.ticket_number'));

    // Filter by priority
    $responsePriority = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/support/tickets?priority=high');
    $responsePriority->assertStatus(200);
    $this->assertCount(1, $responsePriority->json('data'));

    // Search filter
    $responseSearch = $this->actingAs($this->admin, 'sanctum')->getJson('/api/admin/support/tickets?search=Delivery');
    $responseSearch->assertStatus(200);
    $this->assertCount(1, $responseSearch->json('data'));
});

test('admin can view complete ticket details', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'General Inquiry',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')->getJson("/api/admin/support/tickets/{$ticket->id}");
    $response->assertStatus(200)
        ->assertJsonFragment([
            'id' => $ticket->id,
            'ticket_number' => 'MH-TKT-000001',
        ]);
});

test('admin can assign ticket and auto-transition state', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'General Inquiry',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/admin/support/tickets/{$ticket->id}/assign", [
            'assigned_to' => $this->admin->id,
        ]);

    $response->assertStatus(200)
        ->assertJsonFragment([
            'status' => 'assigned',
        ]);

    $this->assertDatabaseHas('support_tickets', [
        'id' => $ticket->id,
        'assigned_to' => $this->admin->id,
        'status' => 'assigned',
    ]);
});

test('admin status update respects support state transitions', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'General Inquiry',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    // 1. Open -> Closed (Allowed)
    $responseAllowed = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/admin/support/tickets/{$ticket->id}/status", [
            'status' => 'closed',
        ]);
    $responseAllowed->assertStatus(200)
        ->assertJsonFragment(['status' => 'closed']);

    // 2. Closed -> Open (Not Allowed)
    $responseRejected = $this->actingAs($this->admin, 'sanctum')
        ->patchJson("/api/admin/support/tickets/{$ticket->id}/status", [
            'status' => 'open',
        ]);
    $responseRejected->assertStatus(422)
        ->assertJsonValidationErrors(['status']);
});

test('admin can reply to ticket and auto-transition state', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'General Inquiry',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'assigned',
    ]);

    $response = $this->actingAs($this->admin, 'sanctum')
        ->postJson("/api/admin/support/tickets/{$ticket->id}/reply", [
            'message' => 'Hello, how can I help you?',
        ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'message' => 'Hello, how can I help you?',
            'is_admin' => true,
        ]);

    $this->assertDatabaseHas('support_messages', [
        'ticket_id' => $ticket->id,
        'message' => 'Hello, how can I help you?',
        'is_admin' => true,
    ]);

    // Assigned -> in_progress (Auto transitioned on admin reply)
    $this->assertEquals('in_progress', $ticket->fresh()->status);
});

test('customer can reply without attachment (backward compatibility)', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", [
            'message' => 'This is a text-only message.',
        ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'message' => 'This is a text-only message.',
            'media' => [],
        ]);
});

test('customer can reply with image attachment and resolves storage URL', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", [
            'message' => 'Here is the screenshot.',
            'media' => [
                [
                    'type' => 'image',
                    'path' => 'support/tickets/tkt-1/screen.png',
                    'mime_type' => 'image/png',
                    'display_order' => 1,
                ]
            ]
        ]);

    $response->assertStatus(201)
        ->assertJsonFragment([
            'message' => 'Here is the screenshot.',
        ])
        ->assertJsonStructure([
            'data' => [
                'media' => [
                    '*' => ['id', 'url', 'type', 'mime_type', 'display_order']
                ]
            ]
        ]);

    // Ensure relative path is stored in the database, not full URL
    $this->assertDatabaseHas('support_message_media', [
        'path' => 'support/tickets/tkt-1/screen.png',
        'mime_type' => 'image/png',
    ]);
});

test('customer can reply with PDF attachment', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", [
            'message' => 'Here is the PDF invoice.',
            'media' => [
                [
                    'type' => 'image',
                    'path' => 'support/tickets/tkt-1/invoice.pdf',
                    'mime_type' => 'application/pdf',
                ]
            ]
        ]);

    $response->assertStatus(201);

    $this->assertDatabaseHas('support_message_media', [
        'path' => 'support/tickets/tkt-1/invoice.pdf',
        'mime_type' => 'application/pdf',
    ]);
});

test('customer can reply with multiple attachment files', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $response = $this->actingAs($this->customer, 'sanctum')
        ->postJson("/api/support/tickets/{$ticket->id}/reply", [
            'message' => 'Multiple files here.',
            'media' => [
                [
                    'type' => 'image',
                    'path' => 'support/tickets/tkt-1/file1.png',
                    'mime_type' => 'image/png',
                    'display_order' => 1,
                ],
                [
                    'type' => 'image',
                    'path' => 'support/tickets/tkt-1/file2.jpg',
                    'mime_type' => 'image/jpeg',
                    'display_order' => 2,
                ]
            ]
        ]);

    $response->assertStatus(201);
    $this->assertCount(2, $response->json('data.media'));
});

test('deleting a support message soft deletes its media attachments', function () {
    $ticket = SupportTicket::create([
        'user_id' => $this->customer->id,
        'ticket_number' => 'MH-TKT-000001',
        'subject' => 'Help',
        'category' => 'General',
        'priority' => 'low',
        'status' => 'open',
    ]);

    $message = SupportMessage::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->customer->id,
        'message' => 'Deleting this soon.',
        'is_admin' => false,
    ]);

    $media = $message->media()->create([
        'path' => 'support/delete.png',
        'type' => 'image',
        'mime_type' => 'image/png',
    ]);

    $this->assertDatabaseHas('support_message_media', [
        'id' => $media->id,
        'deleted_at' => null,
    ]);

    // Delete message
    $message->delete();

    // Verify media is soft deleted
    $this->assertSoftDeleted('support_message_media', [
        'id' => $media->id,
    ]);
});

