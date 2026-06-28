<?php

namespace App\Services\Customer;

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use App\Services\Shared\SupportTicketNumberService;
use App\Services\Shared\MediaService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CustomerSupportService
{
    protected SupportTicketNumberService $ticketNumberService;
    protected MediaService $mediaService;

    public function __construct(SupportTicketNumberService $ticketNumberService, MediaService $mediaService)
    {
        $this->ticketNumberService = $ticketNumberService;
        $this->mediaService = $mediaService;
    }

    /**
     * List own tickets paginated.
     */
    public function listOwnTickets(User $user, int $perPage = 15)
    {
        return SupportTicket::where('user_id', $user->id)
            ->orderBy('id', 'desc')
            ->paginate($perPage);
    }

    /**
     * Get own ticket with loaded conversation history.
     */
    public function getOwnTicket(User $user, SupportTicket $ticket): SupportTicket
    {
        if ($ticket->user_id !== $user->id) {
            throw new \Illuminate\Auth\Access\AuthorizationException('You do not own this ticket.');
        }

        return $ticket->load(['user', 'assignee', 'supportMessages.user', 'supportMessages.media']);
    }

    /**
     * Create a support ticket and its first message inside a transaction.
     */
    public function createTicket(User $user, array $data): SupportTicket
    {
        return DB::transaction(function () use ($user, $data) {
            $ticketNumber = $this->ticketNumberService->generateNextTicketNumber();

            $ticket = SupportTicket::create([
                'user_id' => $user->id,
                'ticket_number' => $ticketNumber,
                'subject' => $data['subject'],
                'category' => $data['category'],
                'priority' => $data['priority'],
                'status' => 'open',
            ]);

            $message = $ticket->supportMessages()->create([
                'user_id' => $user->id,
                'message' => $data['message'] ?? null,
                'is_admin' => false,
            ]);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($message, 'media', $data['media']);
            }

            return $ticket;
        });
    }

    /**
     * Reply to a ticket. Closed tickets reject replies.
     */
    public function replyToTicket(User $user, SupportTicket $ticket, array $data): SupportMessage
    {
        if ($ticket->user_id !== $user->id) {
            throw new \Illuminate\Auth\Access\AuthorizationException('You do not own this ticket.');
        }

        if (strtolower($ticket->status) === 'closed') {
            throw ValidationException::withMessages([
                'ticket' => ['Cannot reply to a closed support ticket.']
            ]);
        }

        return DB::transaction(function () use ($user, $ticket, $data) {
            $message = $ticket->supportMessages()->create([
                'user_id' => $user->id,
                'message' => $data['message'] ?? null,
                'is_admin' => false,
            ]);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($message, 'media', $data['media']);
            }

            return $message;
        });
    }
}
