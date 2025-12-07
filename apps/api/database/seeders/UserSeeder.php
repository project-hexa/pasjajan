<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
		User::create([
			'full_name' => 'Mimin',
			'email' => 'pasjajan032@gmail.com',
			'phone_number' => '+6283134480937',
			'password' => Hash::make('4dmin@dmiN'),
			'role' => 'Admin',
			'status_account' => 'Active',
			'last_login_date' => now(),
		]);
    }
}
