<?php

namespace Database\Factories;

use App\Models\StockMovement;
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class StockMovementFactory extends Factory
{
  protected $model = StockMovement::class;

  public function definition(): array
  {
    $movementType = $this->faker->randomElement(['sale', 'delivery', 'correction']);
    $quantityChange = $movementType === 'sale'
      ? -$this->faker->numberBetween(1, 20)
      : $this->faker->numberBetween(-10, 50);

    return [
      'store_id' => Store::factory(),
      'product_id' => Product::factory(),
      'quantity_change' => $quantityChange,
      'movement_type' => $movementType,
      'order_id' => $movementType === 'sale' ? Order::factory() : null,
      'user_id' => User::factory(),
      'notes' => $this->faker->optional()->sentence(),
    ];
  }
}
