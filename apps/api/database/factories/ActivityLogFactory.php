<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class ActivityLogFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'activity_type' => $this->faker->randomElement(['login', 'update', 'create', 'delete']),
            'description' => $this->faker->sentence(),
            'timestamp' => now(),
            'ip_address' => $this->faker->ipv4(),
        ];
    }
}
