<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProcessPaymentRequest extends FormRequest
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
            'order_code' => 'required|string|exists:orders,code',
            'payment_method_code' => 'required|string|exists:payment_methods,code',
            'shipping_address' => 'nullable|string|max:500',
            'shipping_recipient_name' => 'nullable|string|max:100',
            'shipping_recipient_phone' => 'nullable|string|max:20',
            'voucher_id' => 'nullable|integer',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'order_code.required' => 'Kode order diperlukan',
            'order_code.exists' => 'Order tidak ditemukan',
            'payment_method_code.required' => 'Metode pembayaran harus dipilih',
            'payment_method_code.exists' => 'Metode pembayaran tidak valid',
        ];
    }
}
