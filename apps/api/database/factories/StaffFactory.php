<?php

namespace Database\Factories;

use App\Models\Staff;
use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

class StaffFactory extends Factory
{
  protected $model = Staff::class;

  public function definition(): array
  {
    return [
      'user_id' => User::factory(),
      'store_id' => Store::factory(),
    ];
  }
}
