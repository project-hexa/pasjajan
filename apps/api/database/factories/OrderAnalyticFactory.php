<?php

namespace Database\Factories;

use App\Models\OrderAnalytic;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderAnalyticFactory extends Factory
{
  protected $model = OrderAnalytic::class;

  public function definition(): array
  {
    $startPeriod = $this->faker->dateTimeBetween('-3 months', '-1 month');
    $endPeriod = $this->faker->dateTimeBetween($startPeriod, 'now');

    return [
      'product_id' => Product::factory(),
      'start_period' => $startPeriod,
      'end_period' => $endPeriod,
      'total_sold' => $this->faker->numberBetween(10, 500),
      'sales_trend' => $this->faker->randomElement(['naik', 'turun', 'stabil']),
      'sales_rank' => $this->faker->numberBetween(1, 100),
    ];
  }
}
