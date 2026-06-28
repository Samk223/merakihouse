<?php

namespace App\Services\Shared;

use App\Models\SupportTicket;

class SupportTicketNumberService
{
    /**
     * Generate the next unique support ticket number formatted as MH-TKT-000001.
     */
    public function generateNextTicketNumber(): string
    {
        $lastTicket = SupportTicket::withTrashed()
            ->where('ticket_number', 'like', 'MH-TKT-%')
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;

        if ($lastTicket && preg_match('/MH-TKT-(\d+)/', $lastTicket->ticket_number, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        }

        // Guarantee uniqueness
        do {
            $ticketNumber = 'MH-TKT-' . str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
            $nextNumber++;
        } while (SupportTicket::withTrashed()->where('ticket_number', $ticketNumber)->exists());

        return $ticketNumber;
    }
}
