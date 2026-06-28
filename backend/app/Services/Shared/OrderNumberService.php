<?php

namespace App\Services\Shared;

use App\Models\Order;

class OrderNumberService
{
    /**
     * Generate a unique customer-facing order number in the format MH-YYYY-000001.
     */
    public function generateNextOrderNumber(): string
    {
        $year = date('Y');
        
        // Find the last order created in the current year
        $lastOrder = Order::where('order_number', 'LIKE', "MH-{$year}-%")
            ->orderBy('id', 'desc')
            ->first();

        $nextNumber = 1;
        if ($lastOrder && preg_match('/MH-\d{4}-(\d+)/', $lastOrder->order_number, $matches)) {
            $nextNumber = (int) $matches[1] + 1;
        }

        return 'MH-' . $year . '-' . str_pad((string) $nextNumber, 6, '0', STR_PAD_LEFT);
    }
}
