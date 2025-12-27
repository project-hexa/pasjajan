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

    // Customer User 1
    $user2 = User::create([
      'full_name' => 'reza ageng',
      'email' => 'rezaageng5@gmail.com',
      'phone_number' => '081234567895',
      'password' => Hash::make('Password123'),
      'role' => 'Customer',
      'phone_number_verified_at' => now(),
      'last_login_date' => now(),
    ]);

    Customer::create([
      'user_id' => $user2->id,
      'point' => 0,
    ]);


    // Customer User 1
    $user3 = User::create([
      'full_name' => 'rafi ikhsanul',
      'email' => 'yc66zio@gmail.com',
      'phone_number' => '081234567898',
      'password' => Hash::make('Password123'),
      'role' => 'Customer',
      'phone_number_verified_at' => now(),
      'last_login_date' => now(),
    ]);

    Customer::create([
      'user_id' => $user3->id,
      'point' => 0,
    ]);

    // Customer User 1
    $user4 = User::create([
      'full_name' => 'Azhar Yadi',
      'email' => 'azhar.luthfiadi@gmail.com',
      'phone_number' => '081234567897',
      'password' => Hash::make('Password123!'),
      'role' => 'Customer',
      'phone_number_verified_at' => now(),
      'last_login_date' => now(),
    ]);

    Customer::create([
      'user_id' => $user4->id,
      'point' => 0,
    ]);
  }
}
