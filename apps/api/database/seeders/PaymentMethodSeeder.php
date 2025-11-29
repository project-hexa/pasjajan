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
                'method_name' => 'BCA Virtual Account',
                'payment_type' => 'bank_transfer',
                'icon' => 'bca.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'is_active' => true,
            ],
            [
                'code' => 'va_bni',
                'method_name' => 'BNI Virtual Account',
                'payment_type' => 'bank_transfer',
                'icon' => 'bni.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'is_active' => true,
            ],
            [
                'code' => 'va_bri',
                'method_name' => 'BRI Virtual Account',
                'payment_type' => 'bank_transfer',
                'icon' => 'bri.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'is_active' => true,
            ],
            [
                'code' => 'va_mandiri',
                'method_name' => 'Mandiri Virtual Account',
                'payment_type' => 'bank_transfer',
                'icon' => 'mandiri.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'is_active' => true,
            ],
            [
                'code' => 'va_permata',
                'method_name' => 'Permata Virtual Account',
                'payment_type' => 'bank_transfer',
                'icon' => 'permata.png',
                'fee' => 4000,
                'min_amount' => 10000,
                'max_amount' => 50000000,
                'is_active' => true,
            ],

            // E-Wallets
            [
                'code' => 'gopay',
                'method_name' => 'GoPay',
                'payment_type' => 'e_wallet',
                'icon' => 'gopay.png',
                'fee' => 2000,
                'min_amount' => 1000,
                'max_amount' => 10000000,
                'is_active' => true,
            ],
            [
                'code' => 'shopeepay',
                'method_name' => 'ShopeePay',
                'payment_type' => 'e_wallet',
                'icon' => 'shopeepay.png',
                'fee' => 2000,
                'min_amount' => 1000,
                'max_amount' => 10000000,
                'is_active' => true,
            ],

            // QRIS
            [
                'code' => 'qris',
                'method_name' => 'QRIS (Semua E-Wallet)',
                'payment_type' => 'qris',
                'icon' => 'qris.png',
                'fee' => 0,
                'min_amount' => 1000,
                'max_amount' => 10000000,
                'is_active' => true,
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
