<?php

namespace Database\Factories;

use App\Models\DashboardConfig;
use Illuminate\Database\Eloquent\Factories\Factory;

class DashboardConfigFactory extends Factory
{
  protected $model = DashboardConfig::class;

  public function definition(): array
  {
    return [
      'store_id' => $this->faker->numberBetween(1, 100),
      'store_name' => $this->faker->company() . ' Store',
      'address' => $this->faker->address(),
      'phone' => $this->faker->numerify('08##########'),
      'status' => $this->faker->randomElement(['active', 'inactive']),
    ];
  }
}
