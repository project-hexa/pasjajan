<?php

namespace Database\Factories;

use App\Models\HistoryPoint;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class HistoryPointFactory extends Factory
{
  protected $model = HistoryPoint::class;

  public function definition(): array
  {
    return [
      'customer_id' => Customer::factory(),
      'type' => $this->faker->randomElement(['credit', 'debit']),
      'notes' => $this->faker->optional()->sentence(),
      'total_point' => $this->faker->numberBetween(10, 500),
    ];
  }
}
