<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Store;

class StoreSeeder extends Seeder
{
  public function run(): void
  {
    $stores = [
      [
        'code' => 'JKT01',
        'name' => 'Jakarta Pusat',
        'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
        'phone_number' => '021-12345678',
        'latitude' => -6.208763,
        'longitude' => 106.845599,
        'is_active' => true,
      ],
      [
        'code' => 'JKT02',
        'name' => 'Jakarta Selatan',
        'address' => 'Jl. TB Simatupang No. 45, Jakarta Selatan',
        'phone_number' => '021-87654321',
        'latitude' => -6.287890,
        'longitude' => 106.806789,
        'is_active' => true,
      ],
      [
        'code' => 'BDG01',
        'name' => 'Bandung',
        'address' => 'Jl. Asia Afrika No. 78, Bandung',
        'phone_number' => '022-12345678',
        'latitude' => -6.921472,
        'longitude' => 107.606400,
        'is_active' => true,
      ],
      [
        'code' => 'SBY01',
        'name' => 'Surabaya',
        'address' => 'Jl. Pemuda No. 99, Surabaya',
        'phone_number' => '031-12345678',
        'latitude' => -7.250445,
        'longitude' => 112.768845,
        'is_active' => true,
      ],
      [
        'code' => 'JKT03',
        'name' => 'Jakarta Barat',
        'address' => 'Jl. Panjang No. 56, Jakarta Barat',
        'phone_number' => '021-55512345',
        'latitude' => -6.168478,
        'longitude' => 106.766234,
        'is_active' => false,
      ],
    ];

    foreach ($stores as $store) {
      Store::create($store);
    }
  }
}
