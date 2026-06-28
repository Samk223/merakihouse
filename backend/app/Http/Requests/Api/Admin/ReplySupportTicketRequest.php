<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ReplySupportTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'message' => ['nullable', 'required_without:media', 'string'],
            'media' => ['sometimes', 'array', 'max:' . config('commerce.media.max_files', 5)],
            'media.*.type' => ['required_with:media', 'string', 'in:' . implode(',', config('commerce.media_types', ['image', 'video']))],
            'media.*.path' => ['required_with:media', 'string', 'max:255'],
            'media.*.mime_type' => ['nullable', 'string', 'in:' . implode(',', config('commerce.media.allowed_mime_types', ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'application/pdf']))],
            'media.*.display_order' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
