# Database Seeding Guide

## Cara Menggunakan Database Seeder

Database seeder telah dikonfigurasi untuk mengisi database dengan data dummy yang realistis untuk testing dan development.

### Command Utama

```bash
# Migrasi fresh + seeding (drop all tables, migrate, dan seed)
php artisan migrate:fresh --seed

# Atau menggunakan custom command
php artisan migrate:ordered --fresh --seed

# Hanya jalankan seeder (tanpa migrasi)
php artisan db:seed

# Jalankan seeder specific class
php artisan db:seed --class=DatabaseSeeder
```

### Data yang Akan Di-generate

DatabaseSeeder akan membuat data berikut:

| Entity | Jumlah | Keterangan |
|--------|--------|------------|
| Users | 21 | Termasuk 1 admin (admin@pasjajan.com) |
| Stores | 10 | Toko/cabang |
| Customers | 50 | Customer |
| Staffs | 15 | Staff yang terhubung ke stores |
| Product Categories | 10 | Kategori produk |
| Products | 100 | Produk dengan kategori |
| Payment Methods | 8 | Metode pembayaran |
| Addresses | 100 | Alamat pengiriman |
| Shipment Methods | 7 | Metode pengiriman (JNE, J&T, dll) |
| Vouchers | 20 | Voucher diskon |
| History Points | 200 | Riwayat poin customer |
| Promos | 15 | Promo |
| Carts | 150 | Item di keranjang |
| Customer Vouchers | 100 | Voucher yang dimiliki customer |
| Stock Movements | 300 | Pergerakan stok |
| Promo Stores | ~75 | Relasi promo-store (1-5 per promo) |
| Promo Products | ~150 | Relasi promo-product (3-10 per promo) |
| Orders | 200 | Pesanan |
| Order Items | ~600 | Item pesanan (1-5 per order) |
| Shipments | 200 | Pengiriman |
| Shipment Status Methods | ~600 | Status tracking (2-4 per shipment) |
| Shipment Reviews | 150 | Review pengiriman |
| Order Reports | 12 | Laporan pesanan |
| Order Analytics | 50 | Analitik pesanan per produk |
| Customer Analytics | 50 | Analitik customer |

### Factory yang Tersedia

Semua model memiliki factory untuk generate data:

```php
// Contoh penggunaan factory
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;

// Create single record
$store = Store::factory()->create();

// Create multiple records
$products = Product::factory()->count(10)->create();

// Create with specific attributes
$order = Order::factory()->create([
    'customer_id' => 1,
    'status' => 'COMPLETED',
]);

// Create with relationships
$order = Order::factory()
    ->has(OrderItem::factory()->count(3))
    ->create();
```

### Factory Files

Berikut daftar semua factory yang tersedia:

1. `StoreFactory.php`
2. `CustomerFactory.php`
3. `StaffFactory.php`
4. `ProductCategoryFactory.php`
5. `ProductFactory.php`
6. `PaymentMethodFactory.php`
7. `AddressFactory.php`
8. `ShipmentMethodFactory.php`
9. `VoucherFactory.php`
10. `HistoryPointFactory.php`
11. `CartFactory.php`
12. `CustomerVoucherFactory.php`
13. `PromoFactory.php`
14. `PromoStoreFactory.php`
15. `PromoProductFactory.php`
16. `StockMovementFactory.php`
17. `OrderFactory.php`
18. `OrderItemFactory.php`
19. `ShipmentFactory.php`
20. `ShipmentReviewFactory.php`
21. `ShipmentStatusMethodFactory.php`
22. `OrderReportFactory.php`
23. `OrderAnalyticFactory.php`
24. `CustomerAnalyticFactory.php`
25. `NotificationFactory.php`
26. `DashboardConfigFactory.php`
27. `ActivityLogFactory.php`

### Default Admin User

Setelah seeding, Anda dapat login menggunakan:

- **Email:** admin@pasjajan.com
- **Password:** password (default Laravel factory)

### Tips

1. **Fresh Start:** Gunakan `migrate:fresh --seed` untuk reset database dan isi ulang
2. **Custom Seeder:** Buat seeder tambahan di `database/seeders/` jika butuh data spesifik
3. **Production:** Jangan jalankan seeder di production! Seeder hanya untuk development/testing
4. **Randomize:** Setiap kali seeding akan generate data yang berbeda (random)

### Troubleshooting

Jika ada error saat seeding:

1. Pastikan migrasi sudah dijalankan:
   ```bash
   php artisan migrate:ordered
   ```

2. Clear cache jika perlu:
   ```bash
   php artisan cache:clear
   php artisan config:clear
   ```

3. Jalankan seeder dengan verbose untuk melihat detail error:
   ```bash
   php artisan db:seed -vvv
   ```

4. Cek apakah semua foreign key constraint terpenuhi

### Urutan Seeding

DatabaseSeeder sudah dikonfigurasi dengan urutan yang benar berdasarkan dependency:

1. **Level 0:** Users, Stores, Customers, Staffs, Categories, Payment Methods, Addresses, Shipment Methods
2. **Level 1:** Products, Vouchers, History Points, Promos
3. **Level 2:** Carts, Customer Vouchers, Stock Movements, Promo Relations
4. **Level 3:** Orders, Order Items, Shipments
5. **Level 4:** Analytics & Reports

Urutan ini memastikan semua foreign key sudah ada sebelum membuat record yang membutuhkannya.
