<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'display_order' => ['sometimes', 'integer', 'min:0'],
            'is_active' => ['sometimes', 'boolean'],
            'media' => ['sometimes', 'array'],
            'media.*.type' => ['required_with:media', 'string', Rule::in(config('commerce.media_types', ['image', 'video']))],
            'media.*.path' => ['required_with:media', 'string'],
            'media.*.mime_type' => ['nullable', 'string'],
            'media.*.alt_text' => ['nullable', 'string'],
            'media.*.sort_order' => ['sometimes', 'integer', 'min:0'],
            'media.*.is_primary' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Configure the validator instance and add custom after validation checks.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $media = $this->input('media', []);
            if (is_array($media)) {
                $primaryCount = 0;
                foreach ($media as $item) {
                    if (isset($item['is_primary']) && (bool) $item['is_primary']) {
                        $primaryCount++;
                    }
                }
                if ($primaryCount > 1) {
                    $validator->errors()->add('media', 'Only one media item may be marked as primary.');
                }
            }
        });
    }
}
