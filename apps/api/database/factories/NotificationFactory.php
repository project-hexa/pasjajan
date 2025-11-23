<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
  protected $model = Notification::class;

  public function definition(): array
  {
    $titles = [
      'Pesanan Baru',
      'Pembayaran Berhasil',
      'Pesanan Dikirim',
      'Pesanan Tiba',
      'Promo Spesial',
      'Voucher Baru',
      'Poin Reward',
    ];

    return [
      'title' => $this->faker->randomElement($titles),
      'body' => $this->faker->paragraph(),
      'from_user_id' => $this->faker->optional()->randomElement([null, User::factory()]),
      'to_user_id' => User::factory(),
    ];
  }
}
