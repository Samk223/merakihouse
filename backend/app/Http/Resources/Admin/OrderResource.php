<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'subtotal' => $this->subtotal,
            'shipping' => $this->shipping,
            'total' => $this->total,
            'shipping_address_snapshot' => $this->shipping_address_snapshot,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'customer' => $this->relationLoaded('user') && $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ] : null,
            'order_items' => $this->relationLoaded('orderItems') ? $this->orderItems->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'product' => $item->product ? [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'brand' => $item->product->brand,
                        'media' => ProductMediaResource::collection($item->product->images),
                    ] : null,
                ];
            }) : null,
            'history' => OrderHistoryResource::collection($this->whenLoaded('statusHistories')),
        ];
    }
}
