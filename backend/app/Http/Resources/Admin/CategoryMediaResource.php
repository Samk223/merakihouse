<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class CategoryMediaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            // Storage::url() makes it trivial to swap storage adapters (local, S3, Supabase)
            'url' => Storage::url($this->path),
            'alt_text' => $this->alt_text,
            'sort_order' => (int) $this->sort_order,
            'is_primary' => (bool) $this->is_primary,
        ];
    }
}
