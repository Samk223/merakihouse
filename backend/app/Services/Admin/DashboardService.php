<?php

namespace App\Services\Admin;

use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use App\Models\Order;
use App\Models\Review;

class DashboardService
{
    /**
     * Retrieve aggregate statistics for the admin dashboard.
     */
    public function getStats(): array
    {
        return [
            'total_products' => Product::count(),
            'total_categories' => Category::count(),
            'total_customers' => User::where('role', 'customer')->count(),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'Pending')->count(),
            'delivered_orders' => Order::where('status', 'Delivered')->count(),
            'total_reviews' => Review::count(),
            'average_rating' => round((float) Review::avg('rating'), 1),
            'currency' => config('commerce.currency', 'INR'),
        ];
    }
}
