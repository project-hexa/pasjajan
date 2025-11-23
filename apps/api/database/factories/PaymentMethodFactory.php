<?php

namespace Database\Factories;

use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentMethodFactory extends Factory
{
  protected $model = PaymentMethod::class;

  public function definition(): array
  {
    $methods = ['Bank Transfer', 'E-Wallet', 'Credit Card', 'Debit Card', 'Cash on Delivery'];
    $types = ['QRIS', 'VA', 'E-WALLET', 'CREDIT'];

    return [
      'method_name' => $this->faker->randomElement($methods),
      'payment_type' => $this->faker->randomElement($types),
      'fee' => $this->faker->randomFloat(2, 0, 5000),
    ];
  }
}
