<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Voucher;
use App\Models\Staff;
use Carbon\Carbon;

class VoucherSeeder extends Seeder
{
  public function run(): void
  {
    $staff = Staff::first();
    if (!$staff) {
      $this->command->warn('No staff found, skipping voucher seeder');
      return;
    }

    $vouchers = [
      [
        'code' => 'WELCOME10',
        'name' => 'Welcome Discount 10%',
        'description' => 'Diskon 10% untuk pelanggan baru',
        'discount_value' => 10,
        'required_points' => 0,
        'start_date' => Carbon::now()->subDays(30),
        'end_date' => Carbon::now()->addDays(60),
        'is_active' => true,
        'created_by' => $staff->id,
      ],
      [
        'code' => 'DISC50K',
        'name' => 'Discount Rp50.000',
        'description' => 'Potongan Rp50.000 untuk pembelian minimum Rp200.000',
        'discount_value' => 50000,
        'required_points' => 100,
        'start_date' => Carbon::now()->subDays(15),
        'end_date' => Carbon::now()->addDays(45),
        'is_active' => true,
        'created_by' => $staff->id,
      ],
      [
        'code' => 'FLASH20',
        'name' => 'Flash Sale 20%',
        'description' => 'Flash sale diskon 20%',
        'discount_value' => 20,
        'required_points' => 50,
        'start_date' => Carbon::now()->subDays(7),
        'end_date' => Carbon::now()->addDays(7),
        'is_active' => true,
        'created_by' => $staff->id,
      ],
      [
        'code' => 'MEMBER15',
        'name' => 'Member Discount 15%',
        'description' => 'Diskon member 15%',
        'discount_value' => 15,
        'required_points' => 75,
        'start_date' => Carbon::now()->subMonths(2),
        'end_date' => Carbon::now()->addMonths(3),
        'is_active' => true,
        'created_by' => $staff->id,
      ],
    ];

    foreach ($vouchers as $voucher) {
      Voucher::create($voucher);
    }
  }
}
