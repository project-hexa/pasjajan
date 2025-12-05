<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed payment methods
        $this->call(PaymentMethodSeeder::class);

        // Seed test data for development
        $this->call(TestDataSeeder::class);

        User::factory()->create([
            "username" => "admin",
            "first_name" => "Admin",
            "last_name" => "Satu",
            "role" => "admin",
            "phone_number" => "081234567890",
            "email" => "noreply@pasjajan.com",
            "password" => bcrypt("Admin123!"),
        ]);

        User::factory()->create([
            "username" => "john_doe",
            "first_name" => "john",
            "last_name" => "doe",
            "phone_number" => "085712348765",
            "email" => "john@gmail.com",
            "password" => bcrypt("User123!"),
        ]);

        User::factory(8)->create();
    }
}
