<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Store;
use App\Models\Customer;
use App\Models\Staff;
use App\Models\ProductCategory;
use App\Models\Product;
use App\Models\PaymentMethod;
use App\Models\Address;
use App\Models\ShipmentMethod;
use App\Models\Voucher;
use App\Models\HistoryPoint;
use App\Models\Cart;
use App\Models\CustomerVoucher;
use App\Models\Promo;
use App\Models\PromoStore;
use App\Models\PromoProduct;
use App\Models\StockMovement;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shipment;
use App\Models\ShipmentReview;
use App\Models\ShipmentStatusMethod;
use App\Models\OrderReport;
use App\Models\OrderAnalytic;
use App\Models\CustomerAnalytic;

class DatabaseSeeder extends Seeder
{
  /**
   * Seed the application's database.
   */
  public function run(): void
  {
    $this->command->info('Starting database seeding...');

    // Level 0: Create Users first
    $this->command->info('Creating users...');
    $users = User::factory(20)->create();
    $adminUser = User::factory()->create([
      'first_name' => 'Admin',
      'last_name' => 'User',
      'phone_number' => '081234567890',
      'username' => 'admin',
      'role' => 'admin',
      'status_account' => 'Active',
    ]);
    $this->command->info('Created ' . ($users->count() + 1) . ' users');

    // Level 1: Create base tables
    $this->command->info('Creating stores...');
    $stores = Store::factory(10)->create();
    $this->command->info('Created ' . $stores->count() . ' stores');

    $this->command->info('Creating customers...');
    $customers = Customer::factory(50)->create();
    $this->command->info('Created ' . $customers->count() . ' customers');

    $this->command->info('Creating staffs...');
    $staffs = Staff::factory(15)->create([
      'store_id' => fn() => $stores->random()->id,
    ]);
    $this->command->info('Created ' . $staffs->count() . ' staffs');

    $this->command->info('Creating product categories...');
    $categories = ProductCategory::factory(10)->create();
    $this->command->info('Created ' . $categories->count() . ' product categories');

    $this->command->info('Creating payment methods...');
    $paymentMethods = PaymentMethod::factory(8)->create();
    $this->command->info('Created ' . $paymentMethods->count() . ' payment methods');

    $this->command->info('Creating addresses...');
    $addresses = Address::factory(100)->create();
    $this->command->info('Created ' . $addresses->count() . ' addresses');

    $this->command->info('Creating shipment methods...');
    $shipmentMethods = ShipmentMethod::factory(7)->create();
    $this->command->info('Created ' . $shipmentMethods->count() . ' shipment methods');

    // Level 2: Tables with foreign keys to level 1
    $this->command->info('Creating products...');
    $products = Product::factory(100)->create([
      'product_category_id' => fn() => $categories->random()->id,
    ]);
    $this->command->info('Created ' . $products->count() . ' products');

    $this->command->info('Creating vouchers...');
    $vouchers = Voucher::factory(20)->create();
    $this->command->info('Created ' . $vouchers->count() . ' vouchers');

    $this->command->info('Creating history points...');
    HistoryPoint::factory(200)->create([
      'customer_id' => fn() => $customers->random()->id,
    ]);
    $this->command->info('Created 200 history points');

    $this->command->info('Creating promos...');
    $promos = Promo::factory(15)->create([
      'created_by' => fn() => $users->random()->id,
    ]);
    $this->command->info('Created ' . $promos->count() . ' promos');

    // Level 3: Pivot tables and relations
    $this->command->info('Creating carts...');
    Cart::factory(150)->create([
      'customer_id' => fn() => $customers->random()->id,
      'product_id' => fn() => $products->random()->id,
    ]);
    $this->command->info('Created 150 cart items');

    $this->command->info('Creating customer vouchers...');
    CustomerVoucher::factory(100)->create([
      'customer_id' => fn() => $customers->random()->id,
      'voucher_id' => fn() => $vouchers->random()->id,
    ]);
    $this->command->info('Created 100 customer vouchers');

    $this->command->info('Creating stock movements...');
    StockMovement::factory(300)->create([
      'store_id' => fn() => $stores->random()->id,
      'product_id' => fn() => $products->random()->id,
      'user_id' => fn() => $users->random()->id,
    ]);
    $this->command->info('Created 300 stock movements');

    $this->command->info('Linking promos to stores...');
    foreach ($promos as $promo) {
      PromoStore::factory(rand(1, 5))->create([
        'promo_id' => $promo->id,
        'store_id' => fn() => $stores->random()->id,
      ]);
    }
    $this->command->info('Created promo-store relations');

    $this->command->info('Linking promos to products...');
    foreach ($promos as $promo) {
      PromoProduct::factory(rand(3, 10))->create([
        'promo_id' => $promo->id,
        'product_id' => fn() => $products->random()->id,
      ]);
    }
    $this->command->info('Created promo-product relations');

    // Level 4: Orders and related
    $this->command->info('Creating orders...');
    $orders = Order::factory(200)->create([
      'customer_id' => fn() => $customers->random()->id,
      'voucher_id' => fn() => $vouchers->random()->id,
      'address_id' => fn() => $addresses->random()->id,
      'store_id' => fn() => $stores->random()->id,
      'payment_method_id' => fn() => $paymentMethods->random()->id,
    ]);
    $this->command->info('Created ' . $orders->count() . ' orders');

    $this->command->info('Creating order items...');
    foreach ($orders as $order) {
      OrderItem::factory(rand(1, 5))->create([
        'order_id' => $order->id,
        'product_id' => fn() => $products->random()->id,
      ]);
    }
    $this->command->info('Created order items for all orders');

    $this->command->info('Creating shipments...');
    $shipments = Shipment::factory($orders->count())->create([
      'order_id' => fn() => $orders->random()->id,
      'method_id' => fn() => $shipmentMethods->random()->id,
    ]);
    $this->command->info('Created ' . $shipments->count() . ' shipments');

    $this->command->info('Creating shipment status methods...');
    foreach ($shipments as $shipment) {
      ShipmentStatusMethod::factory(rand(2, 4))->create([
        'shipment_id' => $shipment->id,
      ]);
    }
    $this->command->info('Created shipment status methods');

    $this->command->info('Creating shipment reviews...');
    ShipmentReview::factory(150)->create([
      'shipment_id' => fn() => $shipments->random()->id,
    ]);
    $this->command->info('Created 150 shipment reviews');

    // Level 5: Analytics and Reports
    $this->command->info('Creating order reports...');
    OrderReport::factory(12)->create();
    $this->command->info('Created 12 order reports');

    $this->command->info('Creating order analytics...');
    OrderAnalytic::factory(50)->create([
      'product_id' => fn() => $products->random()->id,
    ]);
    $this->command->info('Created 50 order analytics');

    $this->command->info('Creating customer analytics...');
    CustomerAnalytic::factory(50)->create([
      'customer_id' => fn() => $customers->random()->id,
    ]);
    $this->command->info('Created 50 customer analytics');

    $this->command->newLine();
    $this->command->info('Database seeding completed successfully!');
    $this->command->newLine();
    $this->command->table(
      ['Entity', 'Count'],
      [
        ['Users', User::count()],
        ['Stores', Store::count()],
        ['Customers', Customer::count()],
        ['Staffs', Staff::count()],
        ['Product Categories', ProductCategory::count()],
        ['Products', Product::count()],
        ['Payment Methods', PaymentMethod::count()],
        ['Addresses', Address::count()],
        ['Shipment Methods', ShipmentMethod::count()],
        ['Vouchers', Voucher::count()],
        ['History Points', HistoryPoint::count()],
        ['Promos', Promo::count()],
        ['Carts', Cart::count()],
        ['Customer Vouchers', CustomerVoucher::count()],
        ['Stock Movements', StockMovement::count()],
        ['Promo Stores', PromoStore::count()],
        ['Promo Products', PromoProduct::count()],
        ['Orders', Order::count()],
        ['Order Items', OrderItem::count()],
        ['Shipments', Shipment::count()],
        ['Shipment Status Methods', ShipmentStatusMethod::count()],
        ['Shipment Reviews', ShipmentReview::count()],
        ['Order Reports', OrderReport::count()],
        ['Order Analytics', OrderAnalytic::count()],
        ['Customer Analytics', CustomerAnalytic::count()],
      ]
    );
  }
}
