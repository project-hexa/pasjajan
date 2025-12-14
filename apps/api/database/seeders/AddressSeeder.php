<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Address;
use App\Models\Customer;

class AddressSeeder extends Seeder
{
  public function run(): void
  {
    $customers = Customer::all();

    if ($customers->isEmpty()) {
      $this->command->warn('No customers found, skipping address seeder');
      return;
    }

    foreach ($customers as $customer) {
      Address::create([
        'customer_id' => $customer->id,
        'label' => 'Rumah',
        'detail_address' => 'Jl. Sudirman No. ' . rand(1, 100) . ', Jakarta Selatan, DKI Jakarta 12190',
        'notes_address' => 'Dekat ' . collect(['Indomaret', 'Alfamart', 'Bank BCA', 'Masjid', 'Sekolah'])->random(),
        'recipient_name' => $customer->user->full_name,
        'phone_number' => $customer->user->phone_number,
        'latitude' => -6.2 . rand(10000, 99999),
        'longitude' => 106.8 . rand(10000, 99999),
        'is_default' => true,
      ]);
    }
  }
}
