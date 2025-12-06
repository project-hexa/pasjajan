<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed payment methods
        $this->call(PaymentMethodSeeder::class);

        // Seed test data for development
        $this->call(TestDataSeeder::class);
    }
}
