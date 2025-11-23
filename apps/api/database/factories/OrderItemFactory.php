<?php

namespace Database\Factories;

use App\Models\OrderItem;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
  protected $model = OrderItem::class;

  public function definition(): array
  {
    $price = $this->faker->randomFloat(2, 10000, 500000);
    $quantity = $this->faker->numberBetween(1, 5);

    return [
      'order_id' => Order::factory(),
      'product_id' => Product::factory(),
      'price' => $price,
      'quantity' => $quantity,
      'subtotal' => $price * $quantity,
    ];
  }
}
