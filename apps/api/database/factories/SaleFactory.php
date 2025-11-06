<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Product;
use App\Models\User;
use App\Models\Branch;

class SaleFactory extends Factory
{
    public function definition(): array
    {
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();
        $qty = $this->faker->numberBetween(1, 5);
        $total = $qty * $product->price;

        return [
            'sale_date' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'product_id' => $product->id,
            'quantity_sold' => $qty,
            'total_price' => $total,
            'payment_method' => $this->faker->randomElement(['tunai', 'transfer', 'e-wallet']),
            'admin_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'branch_id' => Branch::inRandomOrder()->first()?->id ?? Branch::factory(),
        ];
    }
}
