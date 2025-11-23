<?php

namespace Database\Factories;

use App\Models\Cart;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class CartFactory extends Factory
{
  protected $model = Cart::class;

  public function definition(): array
  {
    return [
      'customer_id' => Customer::factory(),
      'product_id' => Product::factory(),
      'quantity' => $this->faker->numberBetween(1, 10),
    ];
  }
}
