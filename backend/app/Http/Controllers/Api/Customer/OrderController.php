<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders (newest first).
     */
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
            ->orderBy('created_at', 'desc')
            ->get();

        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'subtotal' => number_format($order->subtotal, 2, '.', ''),
                'shipping' => number_format($order->shipping, 2, '.', ''),
                'total' => number_format($order->total, 2, '.', ''),
                'currency' => config('commerce.currency'),
                'created_at' => $order->created_at->toIso8601String(),
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Orders retrieved successfully.',
            'data' => $formattedOrders,
        ], 200);
    }

    /**
     * Display the specified order details (eager loads orderItems and product info).
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::where('id', $id)
            ->with(['orderItems.product.images'])
            ->first();

        if (! $order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        // Ownership check
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'This action is unauthorized.',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order details retrieved successfully.',
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'subtotal' => number_format($order->subtotal, 2, '.', ''),
                    'shipping' => number_format($order->shipping, 2, '.', ''),
                    'total' => number_format($order->total, 2, '.', ''),
                    'shipping_address_snapshot' => $order->shipping_address_snapshot,
                    'created_at' => $order->created_at->toIso8601String(),
                    'updated_at' => $order->updated_at->toIso8601String(),
                ],
                'order_items' => $order->orderItems,
                'currency' => config('commerce.currency'),
            ]
        ], 200);
    }
}
