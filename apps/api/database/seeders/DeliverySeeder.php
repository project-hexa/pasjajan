<?php

namespace Database\Seeders;

use App\Models\ShipmentMethod;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DeliverySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default Delivery Method
        ShipmentMethod::firstOrCreate(
            ['name' => 'Kurir PasJajan']
        );
    }
}
