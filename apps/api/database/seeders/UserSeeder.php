<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Store;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        $adminUser = User::create([
            'full_name' => 'Admin System',
            'email' => 'admin@pasjajan.com',
            'phone_number' => '+6281234567890',
            'password' => Hash::make('Password123!'),
            'role' => 'Admin',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // Staff User
        $staffUser = User::create([
            'full_name' => 'Staff One',
            'email' => 'staff@pasjajan.com',
            'phone_number' => '+6281234567891',
            'password' => Hash::make('Password123!'),
            'role' => 'Staff',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        // $stores = Store::all();

        // $staffUser->staff()->create([
        // 	'store_id' => $stores->isNotEmpty() ? $stores->random()->id : null,
        // ]);

        // Customer User 1
        $customerUser1 = User::create([
            'full_name' => 'John Doe',
            'email' => 'john@example.com',
            'phone_number' => '+6281234567892',
            'password' => Hash::make('Password123!'),
            'role' => 'Customer',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        $customerUser1->customer()->create([
            'point' => 0,
        ]);

        // Customer User 2
        $customerUser2 = User::create([
            'full_name' => 'Jane Smith',
            'email' => 'jane@example.com',
            'phone_number' => '+6281234567893',
            'password' => Hash::make('Password123!'),
            'role' => 'Customer',
            'phone_number_verified_at' => now(),
            'last_login_date' => now(),
        ]);

        $customerUser1->customer()->create([
            'point' => 0,
        ]);
    }
}
