<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Customer\ReplySupportTicketRequest;
use App\Http\Requests\Api\Customer\StoreSupportTicketRequest;
use App\Http\Resources\SupportMessageResource;
use App\Http\Resources\SupportTicketResource;
use App\Models\SupportTicket;
use App\Services\Customer\CustomerSupportService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    protected CustomerSupportService $supportService;

    public function __construct(CustomerSupportService $supportService)
    {
        $this->supportService = $supportService;
    }

    /**
     * Display a listing of the customer's tickets.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->input('per_page', 15);
        $tickets = $this->supportService->listOwnTickets($request->user(), $perPage);

        return SupportTicketResource::collection($tickets)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Store a newly created support ticket.
     */
    public function store(StoreSupportTicketRequest $request): JsonResponse
    {
        $ticket = $this->supportService->createTicket($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Support ticket created successfully.',
            'data' => new SupportTicketResource($ticket->load(['user', 'supportMessages.user', 'supportMessages.media'])),
        ], 201);
    }

    /**
     * Display the customer's specified ticket.
     */
    public function show(Request $request, SupportTicket $ticket): JsonResponse
    {
        $ticketDetails = $this->supportService->getOwnTicket($request->user(), $ticket);

        return response()->json([
            'success' => true,
            'message' => 'Support ticket details retrieved successfully.',
            'data' => new SupportTicketResource($ticketDetails),
        ], 200);
    }

    /**
     * Reply to the customer's specified ticket.
     */
    public function reply(ReplySupportTicketRequest $request, SupportTicket $ticket): JsonResponse
    {
        $reply = $this->supportService->replyToTicket(
            $request->user(),
            $ticket,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'message' => 'Reply posted successfully.',
            'data' => new SupportMessageResource($reply->load(['user', 'media'])),
        ], 201);
    }
}
