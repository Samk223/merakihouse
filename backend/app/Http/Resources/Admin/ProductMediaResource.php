<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProductMediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'url' => Storage::url($this->path),
            'alt_text' => $this->alt_text,
            'sort_order' => (int) $this->sort_order,
            'is_primary' => (bool) $this->is_primary,
            'mime_type' => $this->mime_type,
        ];
    }
}
