<?php

namespace Database\Factories;

use App\Models\Promo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromoFactory extends Factory
{
  protected $model = Promo::class;

  public function definition(): array
  {
    $startDate = $this->faker->dateTimeBetween('now', '+1 month');

    return [
      'name' => $this->faker->words(3, true),
      'description' => $this->faker->paragraph(),
      'discount_value' => $this->faker->randomFloat(2, 5000, 100000),
      'min_order_value' => $this->faker->randomFloat(2, 50000, 300000),
      'start_date' => $startDate,
      'end_date' => $this->faker->dateTimeBetween($startDate, '+3 months'),
      'status' => $this->faker->randomElement(['active', 'inactive']),
      'applies_to' => $this->faker->randomElement(['all', 'specific']),
      'applies_to_product' => $this->faker->randomElement(['all', 'specific']),
      'created_by' => User::factory(),
    ];
  }
}
