<?php

namespace Database\Factories;

use App\Models\CustomerAnalytic;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerAnalyticFactory extends Factory
{
  protected $model = CustomerAnalytic::class;

  public function definition(): array
  {
    return [
      'customer_id' => Customer::factory(),
      'favorite_product' => $this->faker->words(3, true),
      'purchase_count' => $this->faker->numberBetween(1, 50),
      'transaction_frequency' => $this->faker->randomElement(['low', 'medium', 'high']),
      'total_spending' => $this->faker->randomFloat(2, 100000, 10000000),
      'analysis_period' => $this->faker->optional()->dateTimeBetween('-3 months', 'now'),
    ];
  }
}
