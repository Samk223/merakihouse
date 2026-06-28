<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Validation\Rule;

class StoreWishlistRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'product_id' => [
                'required',
                'integer',
                'exists:products,id',
                Rule::unique('wishlists', 'product_id')->where(function ($query) {
                    return $query->where('user_id', $this->user()->id);
                }),
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'product_id.unique' => 'This product is already in your wishlist.',
        ];
    }
}
