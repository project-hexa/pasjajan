<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PromoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'promo_name' => 'Promo ' . $this->faker->word(),
            'discount_percent' => $this->faker->numberBetween(5, 30),
            'discount_value' => 0,
            'start_date' => now()->subDays(rand(1, 10)),
            'end_date' => now()->addDays(rand(5, 15)),
            'status' => 'aktif',
            'description' => $this->faker->sentence(),
        ];
    }
}
