<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class StoreFactory extends Factory
{
  protected $model = Store::class;

  public function definition(): array
  {
    return [
      'code' => strtoupper($this->faker->unique()->bothify('ST-####')),
      'name' => $this->faker->company() . ' Store',
      'address' => $this->faker->address(),
      'phone_number' => $this->faker->numerify('08##########'),
      'latitude' => $this->faker->latitude(-10, 10),
      'longitude' => $this->faker->longitude(95, 141),
      'is_active' => $this->faker->boolean(90),
    ];
  }
}
