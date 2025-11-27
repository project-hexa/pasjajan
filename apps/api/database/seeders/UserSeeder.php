<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'first_name' => 'Admin',
            'last_name' => 'System',
            'username' => 'admin',
            'email' => 'admin@pasjajan.com',
            'phone_number' => '081234567890',
            'password' => Hash::make('password123'),
            'role' => 'Admin',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Staff User
        User::create([
            'first_name' => 'Staff',
            'last_name' => 'One',
            'username' => 'staff1',
            'email' => 'staff@pasjajan.com',
            'phone_number' => '081234567891',
            'password' => Hash::make('password123'),
            'role' => 'Staff',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Customer User 1
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'phone_number' => '081234567892',
            'password' => Hash::make('password123'),
            'role' => 'Customer',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Customer User 2
        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'username' => 'janesmith',
            'email' => 'jane@example.com',
            'phone_number' => '081234567893',
            'password' => Hash::make('password123'),
            'role' => 'Customer',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);
    }
}
