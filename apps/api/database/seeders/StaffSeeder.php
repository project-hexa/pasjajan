<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Staff;
use App\Models\User;
use App\Models\Store;

class StaffSeeder extends Seeder
{
  public function run(): void
  {
    $stores = Store::all();

    if ($stores->isEmpty()) {
      $this->command->warn('No stores found, skipping staff seeder');
      return;
    }

    $staffData = [
      ['first_name' => 'Manager', 'last_name' => 'Jakarta', 'email' => 'manager.jkt@pasjajan.com', 'phone' => '081234560001'],
      ['first_name' => 'Kasir', 'last_name' => 'Jakarta', 'email' => 'kasir.jkt@pasjajan.com', 'phone' => '081234560002'],
    ];

    foreach ($staffData as $data) {
      $user = User::create([
        'first_name' => $data['first_name'],
        'last_name' => $data['last_name'],
        'username' => strtolower($data['first_name'] . $data['last_name']),
        'email' => $data['email'],
        'phone_number' => $data['phone'],
        'password' => bcrypt('password123'),
        'role' => 'Staff',
        'phone_number_verified_at' => now(),
        'last_login_date' => now(),
      ]);

      Staff::create([
        'user_id' => $user->id,
        'store_id' => $stores->random()->id,
      ]);
    }
  }
}
