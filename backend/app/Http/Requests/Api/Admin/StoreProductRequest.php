<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
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
        $mediaTypes = config('commerce.media_types', ['image', 'video']);

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'short_description' => ['nullable', 'string'],
            'brand' => ['nullable', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'discount_price' => ['nullable', 'numeric', 'min:0'],
            'gst_percentage' => ['sometimes', 'integer', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
            'low_stock_threshold' => ['sometimes', 'integer', 'min:0'],
            'featured' => ['sometimes', 'boolean'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_best_seller' => ['sometimes', 'boolean'],
            'is_new_arrival' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'dimensions' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'media' => ['sometimes', 'array'],
            'product_type' => ['sometimes', 'string', 'max:50'],
            'media.*.id' => ['sometimes', 'integer'],
            'media.*.type' => ['required_with:media', 'string', Rule::in($mediaTypes)],
            'media.*.path' => ['required_with:media', 'string', 'max:255'],
            'media.*.mime_type' => ['nullable', 'string', 'max:100'],
            'media.*.alt_text' => ['nullable', 'string', 'max:255'],
            'media.*.sort_order' => ['sometimes', 'integer', 'min:0'],
            'media.*.is_primary' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Custom validation after rules.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $price = $this->input('price');
            $discountPrice = $this->input('discount_price');

            if ($price !== null && $discountPrice !== null && (float) $discountPrice > (float) $price) {
                $validator->errors()->add('discount_price', 'The discount price must be less than or equal to the price.');
            }

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
