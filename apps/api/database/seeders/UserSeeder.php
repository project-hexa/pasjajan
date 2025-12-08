<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'full_name' => 'Admin System',
            'email' => 'admin@pasjajan.com',
            'phone_number' => '081234567890',
            'password' => Hash::make('Password123'),
            'role' => 'Admin',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Staff User
        User::create([
            'full_name' => 'Staff One',
            'email' => 'staff@pasjajan.com',
            'phone_number' => '081234567891',
            'password' => Hash::make('Password123'),
            'role' => 'Staff',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Customer User 1
        User::create([
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone_number' => '081234567892',
            'password' => Hash::make('Password123'),
            'role' => 'Customer',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Customer User 2
        User::create([
            'full_name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone_number' => '081234567893',
            'password' => Hash::make('Password123'),
            'role' => 'Customer',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);
    }
}
