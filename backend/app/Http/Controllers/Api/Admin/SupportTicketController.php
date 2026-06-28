<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\AssignSupportTicketRequest;
use App\Http\Requests\Api\Admin\ReplySupportTicketRequest;
use App\Http\Requests\Api\Admin\UpdateSupportTicketStatusRequest;
use App\Http\Resources\SupportMessageResource;
use App\Http\Resources\SupportTicketResource;
use App\Models\SupportTicket;
use App\Services\Admin\SupportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    protected SupportService $supportService;

    public function __construct(SupportService $supportService)
    {
        $this->supportService = $supportService;
    }

    /**
     * Display a listing of all support tickets.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'priority', 'category', 'assigned_to', 'search', 'date_from', 'date_to']);
        $perPage = (int) $request->input('per_page', 15);

        $tickets = $this->supportService->paginateTickets($filters, $perPage);

        return SupportTicketResource::collection($tickets)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the specified ticket details.
     */
    public function show(SupportTicket $ticket): JsonResponse
    {
        $ticketDetails = $this->supportService->getTicketDetails($ticket);

        return response()->json([
            'success' => true,
            'message' => 'Support ticket details retrieved successfully.',
            'data' => new SupportTicketResource($ticketDetails),
        ], 200);
    }

    /**
     * Assign the support ticket to an admin.
     */
    public function assign(AssignSupportTicketRequest $request, SupportTicket $ticket): JsonResponse
    {
        $updatedTicket = $this->supportService->assignTicket($ticket, $request->input('assigned_to'));

        return response()->json([
            'success' => true,
            'message' => 'Ticket assigned successfully.',
            'data' => new SupportTicketResource($updatedTicket->load(['user', 'assignee', 'supportMessages.user'])),
        ], 200);
    }

    /**
     * Update the status of the support ticket.
     */
    public function updateStatus(UpdateSupportTicketStatusRequest $request, SupportTicket $ticket): JsonResponse
    {
        $updatedTicket = $this->supportService->updateTicketStatus($ticket, $request->input('status'));

        return response()->json([
            'success' => true,
            'message' => 'Ticket status updated successfully.',
            'data' => new SupportTicketResource($updatedTicket->load(['user', 'assignee', 'supportMessages.user'])),
        ], 200);
    }

    /**
     * Reply to the support ticket.
     */
    public function reply(ReplySupportTicketRequest $request, SupportTicket $ticket): JsonResponse
    {
        $reply = $this->supportService->adminReply(
            $ticket,
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Reply posted successfully.',
            'data' => new SupportMessageResource($reply->load(['user', 'media'])),
        ], 201);
    }
}
