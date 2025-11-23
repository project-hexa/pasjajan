<?php

namespace Database\Factories;

use App\Models\Shipment;
use App\Models\Order;
use App\Models\ShipmentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentFactory extends Factory
{
  protected $model = Shipment::class;

  public function definition(): array
  {
    return [
      'order_id' => Order::factory(),
      'method_id' => ShipmentMethod::factory(),
      'staff_id' => $this->faker->optional()->numberBetween(1, 100),
      'completion_status' => $this->faker->randomElement(['DIKIRIM', 'DELIVERED', 'FAILED']),
      'notes' => $this->faker->optional()->sentence(),
    ];
  }
}
