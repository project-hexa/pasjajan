<?php

namespace Database\Factories;

use App\Models\PromoProduct;
use App\Models\Promo;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromoProductFactory extends Factory
{
  protected $model = PromoProduct::class;

  public function definition(): array
  {
    return [
      'promo_id' => Promo::factory(),
      'product_id' => Product::factory(),
    ];
  }
}
