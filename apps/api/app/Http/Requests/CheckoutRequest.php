<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Dalam production, cek auth di sini
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            // Customer info (dari modul lain)
            'customer_id' => 'required|integer',
            'customer_email' => 'required|email|max:255',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'nullable|string|max:20',

            // References (optional, dari modul lain)
            'address_id' => 'nullable|integer',
            'store_id' => 'nullable|integer',
            'voucher_id' => 'nullable|integer',

            // Shipping address (snapshot dari modul alamat)
            'shipping_address' => 'required|string',
            'shipping_recipient_name' => 'required|string|max:255',
            'shipping_recipient_phone' => 'required|string|max:20',

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
