<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Branch;

class SalesReportFactory extends Factory
{
    public function definition(): array
    {
        return [
            'admin_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'branch_id' => Branch::inRandomOrder()->first()?->id ?? Branch::factory(),
            'start_period' => now()->subDays(30),
            'end_period' => now(),
            'total_sales' => $this->faker->randomFloat(2, 500000, 10000000),
            'transaction_count' => $this->faker->numberBetween(20, 300),
            'total_products_sold' => $this->faker->numberBetween(50, 1000),
            'export_file' => null,
        ];
    }
}
