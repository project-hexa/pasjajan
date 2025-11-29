<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
  public function run(): void
  {
    $paymentMethods = [
      ['method_name' => 'BCA Virtual Account', 'payment_type' => 'bank_transfer', 'fee' => 2500],
      ['method_name' => 'Mandiri Virtual Account', 'payment_type' => 'bank_transfer', 'fee' => 2500],
      ['method_name' => 'BNI Virtual Account', 'payment_type' => 'bank_transfer', 'fee' => 2500],
      ['method_name' => 'GoPay', 'payment_type' => 'e-wallet', 'fee' => 0],
      ['method_name' => 'OVO', 'payment_type' => 'e-wallet', 'fee' => 0],
      ['method_name' => 'QRIS', 'payment_type' => 'qris', 'fee' => 0],
    ];

    foreach ($paymentMethods as $method) {
      PaymentMethod::create($method);
    }
  }
}
