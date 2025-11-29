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
        $this->call([
            UserSeeder::class,
            StoreSeeder::class,
            StaffSeeder::class,
            ProductCategorySeeder::class,
            ProductSeeder::class,
            VoucherSeeder::class,
            PaymentMethodSeeder::class,
            CustomerSeeder::class,
            AddressSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
