<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\User;

class CustomerSeeder extends Seeder
{
  public function run(): void
  {
    $customers = [
      ['first_name' => 'Budi', 'last_name' => 'Santoso', 'email' => 'budi.santoso@email.com', 'phone' => '081234567801'],
      ['first_name' => 'Siti', 'last_name' => 'Nurhaliza', 'email' => 'siti.nur@email.com', 'phone' => '081234567802'],
      ['first_name' => 'Ahmad', 'last_name' => 'Hidayat', 'email' => 'ahmad.hidayat@email.com', 'phone' => '081234567803'],
      ['first_name' => 'Dewi', 'last_name' => 'Lestari', 'email' => 'dewi.lestari@email.com', 'phone' => '081234567804'],
      ['first_name' => 'Rizki', 'last_name' => 'Firmansyah', 'email' => 'rizki.firman@email.com', 'phone' => '081234567805'],
      ['first_name' => 'Nur', 'last_name' => 'Azizah', 'email' => 'nur.azizah@email.com', 'phone' => '081234567806'],
      ['first_name' => 'Eko', 'last_name' => 'Prasetyo', 'email' => 'eko.prasetyo@email.com', 'phone' => '081234567807'],
      ['first_name' => 'Linda', 'last_name' => 'Wijaya', 'email' => 'linda.wijaya@email.com', 'phone' => '081234567808'],
      ['first_name' => 'Agus', 'last_name' => 'Setiawan', 'email' => 'agus.setiawan@email.com', 'phone' => '081234567809'],
      ['first_name' => 'Maya', 'last_name' => 'Kusuma', 'email' => 'maya.kusuma@email.com', 'phone' => '081234567810'],
      ['first_name' => 'Doni', 'last_name' => 'Pratama', 'email' => 'doni.pratama@email.com', 'phone' => '081234567811'],
      ['first_name' => 'Rini', 'last_name' => 'Handayani', 'email' => 'rini.handayani@email.com', 'phone' => '081234567812'],
      ['first_name' => 'Hadi', 'last_name' => 'Wijaksono', 'email' => 'hadi.wijaksono@email.com', 'phone' => '081234567813'],
      ['first_name' => 'Yuni', 'last_name' => 'Rahayu', 'email' => 'yuni.rahayu@email.com', 'phone' => '081234567814'],
      ['first_name' => 'Andi', 'last_name' => 'Permana', 'email' => 'andi.permana@email.com', 'phone' => '081234567815'],
      ['first_name' => 'Tina', 'last_name' => 'Marlina', 'email' => 'tina.marlina@email.com', 'phone' => '081234567816'],
      ['first_name' => 'Fajar', 'last_name' => 'Nugroho', 'email' => 'fajar.nugroho@email.com', 'phone' => '081234567817'],
      ['first_name' => 'Wati', 'last_name' => 'Susanti', 'email' => 'wati.susanti@email.com', 'phone' => '081234567818'],
      ['first_name' => 'Bambang', 'last_name' => 'Suharto', 'email' => 'bambang.suharto@email.com', 'phone' => '081234567819'],
      ['first_name' => 'Retno', 'last_name' => 'Wulandari', 'email' => 'retno.wulandari@email.com', 'phone' => '081234567820'],
    ];

    $existingUser = User::where('email', 'john.doe@email.com')->first();
    if ($existingUser && !Customer::where('user_id', $existingUser->id)->exists()) {
      Customer::create([
        'user_id' => $existingUser->id,
        'point' => rand(0, 1000),
      ]);
    }

    foreach ($customers as $customerData) {
      $user = User::create([
        'full_name' => $customerData['first_name'] . ' ' . $customerData['last_name'],
        'email' => $customerData['email'],
        'phone_number' => $customerData['phone'],
        'password' => bcrypt('password123'),
        'role' => 'Customer',
        'phone_number_verified_at' => now(),
        'last_login_date' => now(),
      ]);

      Customer::create([
        'user_id' => $user->id,
        'point' => rand(0, 1000),
      ]);
    }
  }
}
