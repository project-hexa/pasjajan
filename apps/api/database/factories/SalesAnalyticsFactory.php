<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;

class SalesAnalyticsFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            'start_period' => now()->subDays(rand(30, 90)),
            'end_period' => now(),
            'total_sold' => $this->faker->numberBetween(20, 500),
            'sales_trend' => $this->faker->randomElement(['naik', 'turun', 'stabil']),
            'sales_rank' => $this->faker->numberBetween(1, 10),
        ];
    }
}
