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

    $statuses = ['COMPLETED', 'PENDING'];

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
      $sub_total = 0;
      $orderItems = [];

      for ($j = 0; $j < $itemsCount; $j++) {
        $product = $products->random();
        $quantity = rand(1, 3);
        $price = $product->price;
        $total = $price * $quantity;
        $sub_total += $total;

        $orderItems[] = [
          'product_id' => $product->id,
          'quantity' => $quantity,
          'price' => $price,
          'sub_total' => $total,
        ];
      }

      $discount = rand(0, 10) > 7 ? rand(5000, 50000) : 0;
      $shippingFee = rand(10000, 50000);
      $grandTotal = $sub_total - $discount + $shippingFee;

      $address = Address::where('customer_id', $customer->id)->first();
      $order = Order::create([
        'customer_id' => $customer->id,
        'voucher_id' => Voucher::inRandomOrder()->first()?->id,
        'address_id' => $address?->id,
        'store_id' => $stores->random()->id,
        'payment_method_id' => PaymentMethod::inRandomOrder()->first()?->id,
        'code' => 'ORD-' . strtoupper(uniqid()),
        'shipping_address' => $address ? $address->detail_address : 'Alamat Default',
        'status' => $status,
        'payment_status' => $status === 'COMPLETED' ? 'paid' : 'unpaid',
        'sub_total' => $sub_total,
        'discount' => $discount,
        'shipping_fee' => $shippingFee,
        'grand_total' => $grandTotal,
        'paid_at' => $status === 'COMPLETED' ? $orderDate : null,
        'created_at' => $orderDate,
        'updated_at' => $orderDate,
      ]);

      foreach ($orderItems as $item) {
        OrderItem::create([
          'order_id' => $order->id,
          'product_id' => $item['product_id'],
          'quantity' => $item['quantity'],
          'price' => $item['price'],
          'sub_total' => $item['sub_total'],
        ]);
      }
    }

    // Generate 25 orders for today (daily)
    $today = Carbon::today();
    for ($i = 0; $i < 25; $i++) {
      $customer = $customers->random();
      $orderDate = $today->copy()->addHours(rand(0, 23))->addMinutes(rand(0, 59));

      $status = $statuses[array_rand($statuses)];
      $itemsCount = rand(1, 5);
      $sub_total = 0;
      $orderItems = [];

      for ($j = 0; $j < $itemsCount; $j++) {
        $product = $products->random();
        $quantity = rand(1, 3);
        $price = $product->price;
        $total = $price * $quantity;
        $sub_total += $total;

        $orderItems[] = [
          'product_id' => $product->id,
          'quantity' => $quantity,
          'price' => $price,
          'sub_total' => $total,
        ];
      }

      $discount = rand(0, 10) > 7 ? rand(5000, 50000) : 0;
      $shippingFee = rand(10000, 50000);
      $grandTotal = $sub_total - $discount + $shippingFee;

      $address = Address::where('customer_id', $customer->id)->first();
      $order = Order::create([
        'customer_id' => $customer->id,
        'voucher_id' => Voucher::inRandomOrder()->first()?->id,
        'address_id' => $address?->id,
        'store_id' => $stores->random()->id,
        'payment_method_id' => PaymentMethod::inRandomOrder()->first()?->id,
        'code' => 'ORD-' . strtoupper(uniqid()),
        'shipping_address' => $address ? $address->detail_address : 'Alamat Default',
        'status' => $status,
        'payment_status' => $status === 'COMPLETED' ? 'paid' : 'unpaid',
        'sub_total' => $sub_total,
        'discount' => $discount,
        'shipping_fee' => $shippingFee,
        'grand_total' => $grandTotal,
        'paid_at' => $status === 'COMPLETED' ? $orderDate : null,
        'created_at' => $orderDate,
        'updated_at' => $orderDate,
      ]);

      foreach ($orderItems as $item) {
        OrderItem::create([
          'order_id' => $order->id,
          'product_id' => $item['product_id'],
          'quantity' => $item['quantity'],
          'price' => $item['price'],
          'sub_total' => $item['sub_total'],
        ]);
      }
    }

    // Generate 25 orders for this month (monthly)
    $startOfMonth = Carbon::now()->startOfMonth();
    $endOfMonth = Carbon::now()->endOfMonth();
    for ($i = 0; $i < 25; $i++) {
      $customer = $customers->random();
      $orderDate = Carbon::create(
        $startOfMonth->year,
        $startOfMonth->month,
        rand(1, $endOfMonth->day),
        rand(8, 20),
        rand(0, 59),
        rand(0, 59)
      );

      if ($orderDate->gt($endOfMonth)) {
        $orderDate = $endOfMonth->copy()->subDays(rand(1, 5));
      }

      $status = $statuses[array_rand($statuses)];
      $itemsCount = rand(1, 5);
      $sub_total = 0;
      $orderItems = [];

      for ($j = 0; $j < $itemsCount; $j++) {
        $product = $products->random();
        $quantity = rand(1, 3);
        $price = $product->price;
        $total = $price * $quantity;
        $sub_total += $total;

        $orderItems[] = [
          'product_id' => $product->id,
          'quantity' => $quantity,
          'price' => $price,
          'sub_total' => $total,
        ];
      }

      $discount = rand(0, 10) > 7 ? rand(5000, 50000) : 0;
      $shippingFee = rand(10000, 50000);
      $grandTotal = $sub_total - $discount + $shippingFee;

      $address = Address::where('customer_id', $customer->id)->first();
      $order = Order::create([
        'customer_id' => $customer->id,
        'voucher_id' => Voucher::inRandomOrder()->first()?->id,
        'address_id' => $address?->id,
        'store_id' => $stores->random()->id,
        'payment_method_id' => PaymentMethod::inRandomOrder()->first()?->id,
        'code' => 'ORD-' . strtoupper(uniqid()),
        'shipping_address' => $address ? $address->detail_address : 'Alamat Default',
        'status' => $status,
        'payment_status' => $status === 'COMPLETED' ? 'paid' : 'unpaid',
        'sub_total' => $sub_total,
        'discount' => $discount,
        'shipping_fee' => $shippingFee,
        'grand_total' => $grandTotal,
        'paid_at' => $status === 'COMPLETED' ? $orderDate : null,
        'created_at' => $orderDate,
        'updated_at' => $orderDate,
      ]);

      foreach ($orderItems as $item) {
        OrderItem::create([
          'order_id' => $order->id,
          'product_id' => $item['product_id'],
          'quantity' => $item['quantity'],
          'price' => $item['price'],
          'sub_total' => $item['sub_total'],
        ]);
      }
    }
  }
}
