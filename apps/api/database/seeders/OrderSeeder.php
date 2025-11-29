<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Customer;
use App\Models\Store;
use App\Models\Product;
use App\Models\Voucher;
use App\Models\Address;
use App\Models\PaymentMethod;
use Carbon\Carbon;

class OrderSeeder extends Seeder
{
  public function run(): void
  {
    $customers = Customer::all();
    $stores = Store::where('is_active', true)->get();
    $products = Product::all();

    $statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'COMPLETED', 'PENDING'];

    $startDate = Carbon::now()->subMonths(12);
    $endDate = Carbon::now();

    for ($i = 0; $i < 100; $i++) {
      $customer = $customers->random();

      $orderDate = Carbon::create(
        rand($startDate->year, $endDate->year),
        rand(1, 12),
        rand(1, 28),
        rand(8, 20),
        rand(0, 59),
        rand(0, 59)
      );

      if ($orderDate->gt($endDate)) {
        $orderDate = $endDate->copy()->subDays(rand(1, 30));
      }

      $status = $statuses[array_rand($statuses)];

      $itemsCount = rand(1, 5);
      $subtotal = 0;
      $orderItems = [];

      for ($j = 0; $j < $itemsCount; $j++) {
        $product = $products->random();
        $quantity = rand(1, 3);
        $price = $product->price;
        $total = $price * $quantity;
        $subtotal += $total;

        $orderItems[] = [
          'product_id' => $product->id,
          'quantity' => $quantity,
          'price' => $price,
          'subtotal' => $total,
        ];
      }

      $discount = rand(0, 10) > 7 ? rand(5000, 50000) : 0;
      $shippingFee = rand(10000, 50000);
      $grandTotal = $subtotal - $discount + $shippingFee;

      $order = Order::create([
        'customer_id' => $customer->id,
        'voucher_id' => Voucher::inRandomOrder()->first()?->id,
        'address_id' => Address::where('customer_id', $customer->id)->first()?->id,
        'store_id' => $stores->random()->id,
        'payment_method_id' => PaymentMethod::inRandomOrder()->first()?->id,
        'code' => 'ORD-' . strtoupper(uniqid()),
        'status' => $status,
        'subtotal' => $subtotal,
        'shipping_fee' => $shippingFee,
        'grand_total' => $grandTotal,
        'created_at' => $orderDate,
        'updated_at' => $orderDate,
      ]);

      foreach ($orderItems as $item) {
        OrderItem::create([
          'order_id' => $order->id,
          'product_id' => $item['product_id'],
          'quantity' => $item['quantity'],
          'price' => $item['price'],
          'subtotal' => $item['subtotal'],
        ]);
      }
    }
  }
}
