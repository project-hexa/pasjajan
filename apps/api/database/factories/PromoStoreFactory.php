<?php

namespace Database\Factories;

use App\Models\PromoStore;
use App\Models\Promo;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromoStoreFactory extends Factory
{
  protected $model = PromoStore::class;

  public function definition(): array
  {
    return [
      'promo_id' => Promo::factory(),
      'store_id' => Store::factory(),
    ];
  }
}
