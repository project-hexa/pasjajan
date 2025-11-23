<?php

namespace Database\Factories;

use App\Models\ShipmentStatusMethod;
use App\Models\Shipment;
use Illuminate\Database\Eloquent\Factories\Factory;

class ShipmentStatusMethodFactory extends Factory
{
  protected $model = ShipmentStatusMethod::class;

  public function definition(): array
  {
    $statuses = [
      'Order Dikonfirmasi',
      'Sedang Dikemas',
      'Dalam Perjalanan',
      'Tiba di Kota Tujuan',
      'Dalam Pengiriman',
      'Terkirim',
    ];

    return [
      'shipment_id' => Shipment::factory(),
      'status_name' => $this->faker->randomElement($statuses),
    ];
  }
}
