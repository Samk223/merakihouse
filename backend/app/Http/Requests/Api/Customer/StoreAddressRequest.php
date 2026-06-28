<?php

namespace App\Http\Requests\Api\Customer;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreAddressRequest extends FormRequest
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
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^(?:\+91|91)?[6-9]\d{9}$/'],
            'address_line_1' => ['required', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'regex:/^[1-9]\d{5}$/'],
            'country' => ['nullable', 'string', 'max:255'],
            'is_default' => ['nullable', 'boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (!$this->has('country') || is_null($this->input('country')) || trim($this->input('country')) === '') {
            $this->merge([
                'country' => 'India',
            ]);
        }
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'phone.regex' => 'Please enter a valid 10-digit Indian mobile number (e.g. +919876543210 or 9876543210).',
            'postal_code.regex' => 'Please enter a valid 6-digit Indian PIN code (e.g. 110001).',
        ];
    }
}
