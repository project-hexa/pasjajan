<?php

namespace Database\Factories;

use App\Models\StockMovement;
use App\Models\Store;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
  protected $model = StockMovement::class;

  public function definition(): array
  {
    $movementType = $this->faker->randomElement(['in', 'out']);
    $movements = [
      'in' => ['Purchase', 'Return', 'Adjustment', 'Transfer In'],
      'out' => ['Sale', 'Damaged', 'Transfer Out', 'Expired'],
    ];

    return [
      'store_id' => Store::factory(),
      'product_id' => Product::factory(),
      'movement_name' => $this->faker->randomElement($movements[$movementType]),
      'movement_type' => $movementType,
      'quantity' => $this->faker->numberBetween(1, 50),
      'notes' => $this->faker->optional()->sentence(),
      'user_id' => User::factory(),
      'token' => $this->faker->optional()->uuid(),
    ];
  }
}
