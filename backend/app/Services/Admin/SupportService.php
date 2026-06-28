<?php

namespace App\Services\Admin;

use App\Models\SupportMessage;
use App\Models\SupportTicket;
use App\Models\User;
use App\Services\Shared\MediaService;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SupportService
{
    protected MediaService $mediaService;

    public function __construct(MediaService $mediaService)
    {
        $this->mediaService = $mediaService;
    }
    /**
     * List all support tickets with filters and pagination.
     */
    public function paginateTickets(array $filters = [], int $perPage = 15)
    {
        $query = SupportTicket::with(['user', 'assignee']);

        if (!empty($filters['status'])) {
            $status = strtolower($filters['status']);
            $query->whereRaw('LOWER(status) = ?', [$status]);
        }

        if (!empty($filters['priority'])) {
            $priority = strtolower($filters['priority']);
            $query->whereRaw('LOWER(priority) = ?', [$priority]);
        }

        if (!empty($filters['category'])) {
            $category = strtolower($filters['category']);
            $query->whereRaw('LOWER(category) = ?', [$category]);
        }

        if (!empty($filters['assigned_to'])) {
            $query->where('assigned_to', $filters['assigned_to']);
        }

        if (!empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', $search)
                  ->orWhere('subject', 'like', $search)
                  ->orWhereHas('user', function ($uq) use ($search) {
                      $uq->where('name', 'like', $search)
                         ->orWhere('email', 'like', $search);
                  });
            });
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->orderBy('id', 'desc')->paginate($perPage);
    }

    /**
     * Get complete support ticket details.
     */
    public function getTicketDetails(SupportTicket $ticket): SupportTicket
    {
        return $ticket->load(['user', 'assignee', 'supportMessages.user', 'supportMessages.media']);
    }

    /**
     * Assign ticket inside transaction.
     */
    public function assignTicket(SupportTicket $ticket, int $adminId): SupportTicket
    {
        return DB::transaction(function () use ($ticket, $adminId) {
            $updates = ['assigned_to' => $adminId];

            if (strtolower($ticket->status) === 'open') {
                $transitions = config('commerce.support_ticket_status_transitions', []);
                if (in_array('assigned', $transitions['open'] ?? [])) {
                    $updates['status'] = 'assigned';
                }
            }

            $ticket->update($updates);

            return $ticket->load(['user', 'assignee', 'supportMessages.user', 'supportMessages.media']);
        });
    }

    /**
     * Update status inside transaction with state machine check.
     */
    public function updateTicketStatus(SupportTicket $ticket, string $newStatus): SupportTicket
    {
        $currentStatus = strtolower($ticket->status);
        $targetStatus = strtolower($newStatus);

        $transitions = config('commerce.support_ticket_status_transitions', []);
        $allowed = $transitions[$currentStatus] ?? [];

        if ($currentStatus !== $targetStatus && !in_array($targetStatus, $allowed)) {
            throw ValidationException::withMessages([
                'status' => ["The support ticket status transition from '{$ticket->status}' to '{$newStatus}' is not allowed."]
            ]);
        }

        return DB::transaction(function () use ($ticket, $targetStatus) {
            $updates = ['status' => $targetStatus];

            if ($targetStatus === 'resolved') {
                $updates['resolved_at'] = now();
            } elseif ($targetStatus === 'closed') {
                $updates['closed_at'] = now();
            }

            $ticket->update($updates);

            return $ticket->load(['user', 'assignee', 'supportMessages.user', 'supportMessages.media']);
        });
    }

    /**
     * Admin reply. Set is_admin=true.
     */
    public function adminReply(SupportTicket $ticket, User $admin, array $data): SupportMessage
    {
        return DB::transaction(function () use ($ticket, $admin, $data) {
            $newMsg = $ticket->supportMessages()->create([
                'user_id' => $admin->id,
                'message' => $data['message'] ?? null,
                'is_admin' => true,
            ]);

            if (isset($data['media']) && is_array($data['media'])) {
                $this->mediaService->syncMedia($newMsg, 'media', $data['media']);
            }

            if (strtolower($ticket->status) === 'assigned') {
                $transitions = config('commerce.support_ticket_status_transitions', []);
                if (in_array('in_progress', $transitions['assigned'] ?? [])) {
                    $ticket->update(['status' => 'in_progress']);
                }
            }

            return $newMsg;
        });
    }
}
