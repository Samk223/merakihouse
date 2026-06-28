<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'name' => $this->name,
            'slug' => $this->slug,
            'sku' => $this->sku,
            'brand' => $this->brand,
            'short_description' => $this->short_description,
            'description' => $this->description,
            'price' => $this->price,
            'discount_price' => $this->discount_price,
            'stock' => (int) $this->stock,
            'low_stock_threshold' => (int) $this->low_stock_threshold,
            'gst_percentage' => (int) $this->gst_percentage,
            'featured' => (bool) $this->featured,
            'is_featured' => (bool) $this->is_featured,
            'is_best_seller' => (bool) $this->is_best_seller,
            'is_new_arrival' => (bool) $this->is_new_arrival,
            'is_active' => (bool) $this->is_active,
            'weight' => $this->weight,
            'dimensions' => $this->dimensions,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'media' => ProductMediaResource::collection($this->whenLoaded('images')),
        ];
    }
}
