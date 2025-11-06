<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class BroadcastMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => 'Pesan ' . $this->faker->word(),
            'content' => $this->faker->paragraph(),
            'target_audience' => 'semua pelanggan',
            'send_mode' => $this->faker->randomElement(['sync', 'async']),
            'status' => $this->faker->randomElement(['pending', 'sent', 'failed']),
            'sent_at' => now(),
            'total_recipient' => $this->faker->numberBetween(50, 500),
        ];
    }
}
