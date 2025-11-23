<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
  protected $model = Customer::class;

  public function definition(): array
  {
    return [
      'user_id' => User::factory(),
      'point' => $this->faker->numberBetween(0, 10000),
    ];
  }
}
