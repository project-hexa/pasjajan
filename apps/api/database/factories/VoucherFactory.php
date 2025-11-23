<?php

namespace Database\Factories;

use App\Models\Voucher;
use App\Models\User;
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
      'description' => $this->faker->optional()->sentence(),
      'discount_value' => $this->faker->randomFloat(2, 5000, 100000),
      'required_points' => $this->faker->numberBetween(0, 1000),
      'start_date' => $startDate,
      'end_date' => $this->faker->dateTimeBetween($startDate, '+3 months'),
      'is_active' => $this->faker->boolean(80),
      'created_by' => User::factory(),
    ];
  }
}
