<?php

namespace Database\Factories;

use App\Models\ProductCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductCategoryFactory extends Factory
{
  protected $model = ProductCategory::class;

  public function definition(): array
  {
    $name = $this->faker->words(2, true);
    return [
      'name' => ucwords($name),
      'slug' => Str::slug($name),
    ];
  }
}
