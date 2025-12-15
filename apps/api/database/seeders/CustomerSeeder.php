<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CustomerSeeder extends Seeder
{
  public function run(): void
  {
    // Customer User 1
    $user1 = User::create([
      'full_name' => 'Azhar Utama',
      'email' => 'azharutama837@gmail.com',
      'phone_number' => '081234567894',
      'password' => Hash::make('Password123'),
      'role' => 'Customer',
      'phone_number_verified_at' => now(),
      'last_login_date' => now(),
    ]);

    Customer::create([
      'user_id' => $user1->id,
      'point' => 0,
    ]);
  }
}
