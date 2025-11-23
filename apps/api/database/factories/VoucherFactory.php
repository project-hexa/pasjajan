<?php

namespace Database\Factories;

use App\Models\Voucher;
use Illuminate\Database\Eloquent\Factories\Factory;

class VoucherFactory extends Factory
{
  protected $model = Voucher::class;

  public function definition(): array
  {
    $startDate = $this->faker->dateTimeBetween('now', '+1 month');

    return [
      'code' => strtoupper($this->faker->unique()->bothify('VOUCHER-####')),
      'name' => $this->faker->words(3, true),
      'code_gcm' => $this->faker->optional()->bothify('GCM-##########'),
      'discount_value' => $this->faker->randomFloat(2, 5000, 100000),
      'min_order_value' => $this->faker->randomFloat(2, 50000, 200000),
      'required_points' => $this->faker->optional()->numberBetween(100, 1000),
      'start_date' => $startDate,
      'end_date' => $this->faker->dateTimeBetween($startDate, '+3 months'),
      'is_active' => $this->faker->boolean(80),
    ];
  }
}
