<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
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
        $allowedStatuses = config('commerce.order_status', []);

        return [
            'status' => [
                'required',
                'string',
                function ($attribute, $value, $fail) use ($allowedStatuses) {
                    if (!in_array(strtolower($value), $allowedStatuses)) {
                        $fail("The selected status is invalid.");
                    }
                }
            ],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
