<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            // Virtual Accounts
            [
                'code' => 'va_bca',
                'name' => 'BCA Virtual Account',
                'category' => 'bank_transfer',
                'channel' => 'bca',
                'icon' => 'bca.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'description' => 'Transfer via BCA Virtual Account',
                'is_active' => true,
                'display_order' => 1,
            ],
            [
                'code' => 'va_bni',
                'name' => 'BNI Virtual Account',
                'category' => 'bank_transfer',
                'channel' => 'bni',
                'icon' => 'bni.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'description' => 'Transfer via BNI Virtual Account',
                'is_active' => true,
                'display_order' => 2,
            ],
            [
                'code' => 'va_bri',
                'name' => 'BRI Virtual Account',
                'category' => 'bank_transfer',
                'channel' => 'bri',
                'icon' => 'bri.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'description' => 'Transfer via BRI Virtual Account',
                'is_active' => true,
                'display_order' => 3,
            ],
            [
                'code' => 'va_mandiri',
                'name' => 'Mandiri Virtual Account',
                'category' => 'bank_transfer',
                'channel' => 'mandiri',
                'icon' => 'mandiri.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'description' => 'Transfer via Mandiri Bill Payment',
                'is_active' => true,
                'display_order' => 4,
            ],
            [
                'code' => 'va_permata',
                'name' => 'Permata Virtual Account',
                'category' => 'bank_transfer',
                'channel' => 'permata',
                'icon' => 'permata.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'description' => 'Transfer via Permata Virtual Account',
                'is_active' => true,
                'display_order' => 5,
            ],

            // E-Wallets
            [
                'code' => 'gopay',
                'name' => 'GoPay',
                'category' => 'e_wallet',
                'channel' => 'gopay',
                'icon' => 'gopay.png',
                'fee' => 2000,
                'min_amount' => 1000,
                'max_amount' => 10000000,
                'description' => 'Bayar menggunakan GoPay',
                'is_active' => true,
                'display_order' => 6,
            ],
            [
                'code' => 'shopeepay',
                'name' => 'ShopeePay',
                'category' => 'e_wallet',
                'channel' => 'shopeepay',
                'icon' => 'shopeepay.png',
                'fee' => 2000,
                'min_amount' => 1000,
                'max_amount' => 10000000,
                'description' => 'Bayar menggunakan ShopeePay',
                'is_active' => true,
                'display_order' => 7,
            ],

            // QRIS
            [
                'code' => 'qris',
                'name' => 'QRIS (Semua E-Wallet)',
                'category' => 'qris',
                'channel' => 'qris',
                'icon' => 'qris.png',
                'fee' => 0,
                'min_amount' => 1000,
                'max_amount' => 10000000,
                'description' => 'Scan QR dengan aplikasi e-wallet favorit Anda',
                'is_active' => true,
                'display_order' => 8,
            ],


        ];

        foreach ($paymentMethods as $method) {
            DB::table('payment_methods')->insert(array_merge($method, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }
}
