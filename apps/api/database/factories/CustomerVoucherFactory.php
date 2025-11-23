<?php

namespace Database\Factories;

use App\Models\CustomerVoucher;
use App\Models\Customer;
use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerVoucherFactory extends Factory
{
  protected $model = CustomerVoucher::class;

  public function definition(): array
  {
    $redeemedAt = $this->faker->optional(0.7)->dateTimeBetween('-2 months', 'now');
    $isUsed = $redeemedAt ? $this->faker->boolean(50) : false;

    return [
      'customer_id' => Customer::factory(),
      'voucher_id' => Voucher::factory(),
      'redeemed_at' => $redeemedAt,
      'is_used' => $isUsed,
      'used_at' => $isUsed ? $this->faker->dateTimeBetween($redeemedAt ?? '-1 month', 'now') : null,
    ];
  }
}
