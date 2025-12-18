<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Auth::check(); // Hanya user terautentikasi
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Customer ID tidak perlu dikirim - diambil dari auth user
            'customer_id' => 'nullable|integer',

            // References (optional, dari modul lain)
            'address_id' => 'nullable|integer|exists:addresses,id', // Jika ada, shipping diambil dari sini
            'store_id' => 'nullable|integer',
            'voucher_id' => 'nullable|integer',

            // Shipping address - required jika tidak ada address_id
            // Jika address_id dikirim, data shipping diambil dari Address model
            'shipping_address' => 'nullable|required_without:address_id|string',
            'shipping_recipient_name' => 'nullable|required_without:address_id|string|max:255',
            'shipping_recipient_phone' => 'nullable|required_without:address_id|string|max:20',

            // Items (dari modul katalog)
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',

            // Pricing (dari modul lain, sudah final)
            'sub_total' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'shipping_fee' => 'required|numeric|min:0',
            'admin_fee' => 'nullable|numeric|min:0',
            'grand_total' => 'required|numeric|min:0',

            // Notes
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Custom validation messages
     */
    public function messages(): array
    {
        return [
            'customer_id.required' => 'Customer ID diperlukan',
            'customer_email.required' => 'Email diperlukan',
            'customer_email.email' => 'Format email tidak valid',
            'customer_name.required' => 'Nama customer diperlukan',
            'shipping_address.required' => 'Alamat pengiriman diperlukan',
            'shipping_recipient_name.required' => 'Nama penerima diperlukan',
            'shipping_recipient_phone.required' => 'Nomor telepon penerima diperlukan',
            'items.required' => 'Minimal 1 item harus ada',
            'items.*.product_id.required' => 'Product ID diperlukan untuk setiap item',
            'items.*.price.required' => 'Harga diperlukan untuk setiap item',
            'items.*.quantity.min' => 'Quantity minimal 1',
            'grand_total.required' => 'Total pembayaran diperlukan',
        ];
    }

    /**
     * Prepare data for validation
     */
    protected function prepareForValidation(): void
    {
        // Auto-calculate item subtotals
        if ($this->has('items')) {
            $items = $this->items;
            foreach ($items as &$item) {
                if (isset($item['price']) && isset($item['quantity'])) {
                    $item['sub_total'] = $item['price'] * $item['quantity'];
                }
            }
            $this->merge(['items' => $items]);
        }
    }
}
