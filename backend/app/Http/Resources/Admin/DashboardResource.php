<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'total_products' => (int) $this['total_products'],
            'total_categories' => (int) $this['total_categories'],
            'total_customers' => (int) $this['total_customers'],
            'total_orders' => (int) $this['total_orders'],
            'pending_orders' => (int) $this['pending_orders'],
            'delivered_orders' => (int) $this['delivered_orders'],
            'total_reviews' => (int) $this['total_reviews'],
            'average_rating' => (float) $this['average_rating'],
            'currency' => $this['currency'],
        ];
    }
}
