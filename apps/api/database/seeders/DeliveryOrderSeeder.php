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
use App\Models\Shipment;
use App\Models\ShipmentStatusLog;
use Carbon\Carbon;
use Illuminate\Support\Str;

class DeliveryOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = Customer::all();
        $stores = Store::where('is_active', true)->get();
        $products = Product::all();

        // Create 5 Dummy Delivery Orders
        // Use the first customer (John Doe) for predictable testing
        $targetCustomer = Customer::first();

        for ($i = 0; $i < 5; $i++) {
            $customer = $targetCustomer;
            $address = Address::where('customer_id', $customer->id)->first();
            $status = 'TERIMA_PESANAN'; // For testing reviews etc.

            // 1. Create Order
            $order = Order::create([
                'customer_id' => $customer->id,
                'voucher_id' => null,
                'address_id' => $address?->id,
                'store_id' => $stores->random()->id,
                'payment_method_id' => 1,
                'code' => 'DEL-' . strtoupper(Str::random(8)),
                'shipping_address' => $address ? $address->detail_address : 'Alamat Test Delivery',
                'shipping_recipient_name' => $customer->user->full_name,
                'shipping_recipient_phone' => $customer->user->phone_number,
                'status' => 'COMPLETED',
                'payment_status' => 'paid',
                'sub_total' => 50000,
                'discount' => 0,
                'shipping_fee' => 5000,
                'admin_fee' => 1000,
                'grand_total' => 56000,
                'paid_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]);

            // 2. Create Order Items
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $products->random()->id,
                'quantity' => 1,
                'price' => 50000,
                'sub_total' => 50000,
            ]);

            // 3. Create Shipment
            $shipment = Shipment::create([
                'order_id' => $order->id,
                'method_id' => 1, // Kurir PasJajan
                'cost' => 5000,
                'completion_status' => $status,
                'courier_name' => 'Kurir PasJajan',
                'courier_phone' => '08123456789'
            ]);

            // 4. Create Shipment Log
            ShipmentStatusLog::create([
                'shipment_id' => $shipment->id,
                'status_name' => $shipment->completion_status,
                'note' => 'Status awal dari DeliveryOrderSeeder'
            ]);
        }
    }
}
