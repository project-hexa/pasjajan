<?php

namespace Database\Factories;

use App\Models\ShipmentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentMethodFactory extends Factory
{
  protected $model = ShipmentMethod::class;

  public function definition(): array
  {
    $methods = ['JNE', 'J&T Express', 'SiCepat', 'AnterAja', 'Ninja Xpress', 'Gosend', 'Grab Express'];

    return [
      'name' => $this->faker->randomElement($methods),
    ];
  }
}
