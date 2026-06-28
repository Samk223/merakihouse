<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupportMessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'ticket_id' => $this->ticket_id,
            'message' => $this->message,
            'is_admin' => (bool) $this->is_admin,
            'created_at' => $this->created_at,
            'user' => $this->relationLoaded('user') && $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'email' => $this->user->email,
            ] : null,
            'media' => $this->relationLoaded('media') ? $this->media->map(function ($item) {
                return [
                    'id' => $item->id,
                    'url' => \Illuminate\Support\Facades\Storage::url($item->path),
                    'type' => $item->type,
                    'mime_type' => $item->mime_type,
                    'display_order' => (int) $item->display_order,
                ];
            }) : [],
        ];
    }
}
