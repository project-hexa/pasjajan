<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Customer;
use App\Models\Voucher;
use App\Models\Address;
use App\Models\Store;
use App\Models\PaymentMethod;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
  protected $model = Order::class;

  public function definition(): array
  {
    $subTotal = $this->faker->randomFloat(2, 50000, 1000000);
    $discount = $this->faker->randomFloat(2, 0, $subTotal * 0.2);
    $shippingFee = $this->faker->randomFloat(2, 5000, 50000);
    $grandTotal = $subTotal - $discount + $shippingFee;

    return [
      'customer_id' => Customer::factory(),
      'voucher_id' => $this->faker->optional()->randomElement([null, Voucher::factory()]),
      'address_id' => Address::factory(),
      'store_id' => Store::factory(),
      'payment_method_id' => PaymentMethod::factory(),
      'code' => strtoupper($this->faker->unique()->bothify('ORD-########')),
      'status' => $this->faker->randomElement(['PENDING', 'PROCESSING', 'PROCESSED', 'COMPLETED']),
      'sub_total' => $subTotal,
      'discount' => $discount,
      'shipping_fee' => $shippingFee,
      'grand_total' => $grandTotal,
      'midtrans_transaction_id' => $this->faker->optional()->uuid(),
      'midtrans_order_id' => $this->faker->optional()->bothify('MT-########'),
      'payment_instructions' => $this->faker->optional()->randomElement([
        ['va_number' => $this->faker->numerify('################')],
        ['qr_code' => $this->faker->url()],
      ]),
      'payment_status' => $this->faker->randomElement(['PENDING', 'SETTLEMENT', 'EXPIRE']),
      'paid_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
      'expired_at' => $this->faker->optional()->dateTimeBetween('now', '+1 day'),
      'notes' => $this->faker->optional()->sentence(),
    ];
  }
}
