<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Branch;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_name' => $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 10000, 500000),
            'description' => $this->faker->sentence(),
            'stock' => $this->faker->numberBetween(10, 200),
            'branch_id' => Branch::inRandomOrder()->first()?->id ?? Branch::factory(),
            'status' => $this->faker->randomElement(['aktif', 'nonaktif']),
        ];
    }
}
