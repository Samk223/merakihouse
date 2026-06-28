<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Services\Customer\CheckoutService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CheckoutController extends Controller
{
    protected CheckoutService $checkoutService;

    /**
     * Inject the CheckoutService dependencies.
     */
    public function __construct(CheckoutService $checkoutService)
    {
        $this->checkoutService = $checkoutService;
    }

    /**
     * Complete the user's checkout and create an order.
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Only customer accounts can checkout
        if ($request->user()->role !== 'customer') {
            return response()->json([
                'success' => false,
                'message' => 'Checkout is restricted to customer accounts only.',
            ], 403);
        }

        // 2. Validate request payload
        $request->validate([
            'address_id' => ['nullable', 'integer'],
        ]);

        $addressId = $request->input('address_id');

        // 2. Delegate checkout process to the service layer
        $order = $this->checkoutService->checkout($request->user(), $addressId);

        // 3. Return a standardized success response containing order aggregates
        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully.',
            'data' => [
                'order' => [
                    'id' => $order->id,
                    'user_id' => $order->user_id,
                    'status' => $order->status,
                    'payment_status' => $order->payment_status,
                    'subtotal' => number_format($order->subtotal, 2, '.', ''),
                    'shipping' => number_format($order->shipping, 2, '.', ''),
                    'total' => number_format($order->total, 2, '.', ''),
                    'shipping_address_snapshot' => $order->shipping_address_snapshot,
                    'created_at' => $order->created_at->toIso8601String(),
                    'updated_at' => $order->updated_at->toIso8601String(),
                ],
                'order_items' => $order->orderItems()->with('product.images')->get(),
                'currency' => config('commerce.currency'),
            ]
        ], 201);
    }
}
