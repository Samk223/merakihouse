<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\UpdateOrderStatusRequest;
use App\Http\Resources\Admin\OrderHistoryResource;
use App\Http\Resources\Admin\OrderResource;
use App\Models\Order;
use App\Services\Admin\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected OrderService $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display a listing of the paginated orders.
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'payment_status', 'search', 'date_from', 'date_to']);
        $perPage = (int) $request->input('per_page', 15);

        $orders = $this->orderService->paginateOrders($filters, $perPage);

        return OrderResource::collection($orders)
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the specified order details.
     */
    public function show(Order $order): JsonResponse
    {
        $orderWithRelations = $this->orderService->getOrder($order);

        return (new OrderResource($orderWithRelations))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Update the status of the specified order.
     */
    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $validated = $request->validated();
        $updatedOrder = $this->orderService->updateOrderStatus(
            $order,
            $validated['status'],
            $validated['remarks'] ?? null,
            $request->user()
        );

        return (new OrderResource($updatedOrder))
            ->response()
            ->setStatusCode(200);
    }

    /**
     * Display the status transition history for the specified order.
     */
    public function history(Order $order): JsonResponse
    {
        $histories = $order->statusHistories()
            ->with('changer')
            ->orderBy('id', 'desc')
            ->get();

        return OrderHistoryResource::collection($histories)
            ->response()
            ->setStatusCode(200);
    }
}
