<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
  protected $model = Product::class;

  public function definition(): array
  {
    return [
      'product_category_id' => ProductCategory::factory(),
      'name' => $this->faker->words(3, true),
      'code' => strtoupper($this->faker->unique()->bothify('PRD-####')),
      'description' => $this->faker->paragraph(),
      'price' => $this->faker->randomFloat(2, 10000, 1000000),
      'stock' => $this->faker->numberBetween(0, 100),
      'image_url' => $this->faker->imageUrl(640, 480, 'products', true),
    ];
  }
}
