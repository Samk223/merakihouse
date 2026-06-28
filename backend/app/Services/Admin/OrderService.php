<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    /**
     * Retrieve paginated orders with filters and sorted by latest.
     */
    public function paginateOrders(array $filters = [], int $perPage = 15)
    {
        $query = Order::with(['user']);

        if (!empty($filters['status'])) {
            $status = strtolower($filters['status']);
            $query->whereRaw('LOWER(status) = ?', [$status]);
        }

        if (!empty($filters['payment_status'])) {
            $paymentStatus = strtolower($filters['payment_status']);
            $query->whereRaw('LOWER(payment_status) = ?', [$paymentStatus]);
        }

        if (!empty($filters['search'])) {
            $search = '%' . $filters['search'] . '%';
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', $search)
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
     * Get single order details with preloaded relationships.
     */
    public function getOrder(Order $order): Order
    {
        return $order->load([
            'user',
            'orderItems.product.images',
            'statusHistories.changer'
        ]);
    }

    /**
     * Update order status within a transaction and insert history audit record.
     */
    public function updateOrderStatus(Order $order, string $newStatus, ?string $remarks, User $changer): Order
    {
        $currentStatusNormalized = strtolower($order->status);
        $newStatusNormalized = strtolower($newStatus);

        // Retrieve transitions state machine map from config
        $transitions = config('commerce.order_status_transitions', []);
        $allowedTransitions = $transitions[$currentStatusNormalized] ?? [];

        // Check if transition is valid
        if (!in_array($newStatusNormalized, $allowedTransitions)) {
            throw ValidationException::withMessages([
                'status' => ["The order status transition from '{$order->status}' to '" . ucfirst($newStatusNormalized) . "' is not allowed."]
            ]);
        }

        return DB::transaction(function () use ($order, $newStatusNormalized, $remarks, $changer) {
            $oldStatus = $order->status;
            $updatedStatus = ucfirst($newStatusNormalized);

            // Update order status
            $order->update([
                'status' => $updatedStatus,
            ]);

            // Create status history log
            $order->statusHistories()->create([
                'old_status' => $oldStatus,
                'new_status' => $updatedStatus,
                'changed_by' => $changer->id,
                'remarks' => $remarks,
            ]);

            return $order->load([
                'user',
                'orderItems.product.images',
                'statusHistories.changer'
            ]);
        });
    }
}
