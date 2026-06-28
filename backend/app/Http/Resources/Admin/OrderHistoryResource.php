<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'old_status' => $this->old_status,
            'new_status' => $this->new_status,
            'remarks' => $this->remarks,
            'changed_by' => $this->changer ? [
                'id' => $this->changer->id,
                'name' => $this->changer->name,
                'email' => $this->changer->email,
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
