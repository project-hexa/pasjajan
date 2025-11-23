# Database Schema - 29 Tables

## Daftar Tabel yang Telah Dibuat

Berikut adalah 29 tabel beserta migrasi, model, dan factory yang telah dibuat:

### 1. **stores** - Tabel Toko/Cabang
- **Relasi:**
  - HasMany: `stockMovements`, `orders`, `promoStores`
  - BelongsToMany: `promos` (through promo_stores)

### 2. **users** - Tabel User (Sudah ada sebelumnya)
- **Relasi yang ditambahkan:**
  - HasMany: `activityLogs`, `notifications`, `stockMovements`
  - HasOne: `customer`, `staff`

### 3. **customers** - Tabel Customer
- **Relasi:**
  - BelongsTo: `user`
  - HasMany: `historyPoints`, `carts`, `customerVouchers`, `orders`, `customerAnalytics`
  - BelongsToMany: `vouchers` (through customer_vouchers)

### 4. **staffs** - Tabel Staff
- **Relasi:**
  - BelongsTo: `user`, `store`

### 5. **product_categories** - Tabel Kategori Produk
- **Relasi:**
  - HasMany: `products`

### 6. **payment_methods** - Tabel Metode Pembayaran
- **Relasi:**
  - HasMany: `orders`

### 7. **address** - Tabel Alamat Pengiriman
- **Relasi:**
  - HasMany: `orders`

### 8. **shipment_methods** - Tabel Metode Pengiriman
- **Relasi:**
  - HasMany: `shipments`

### 9. **notifications** - Tabel Notifikasi
- **Relasi:**
  - BelongsTo: `fromUser`, `toUser`

### 10. **dashboard_config** - Tabel Konfigurasi Dashboard
- Tidak ada relasi

### 11. **activity_log** - Tabel Log Aktivitas
- **Relasi:**
  - BelongsTo: `user`

### 12. **products** - Tabel Produk
- **Relasi:**
  - BelongsTo: `productCategory`
  - HasMany: `carts`, `orderItems`, `stockMovements`, `orderAnalytics`, `promoProducts`
  - BelongsToMany: `promos` (through promo_products)

### 13. **history_points** - Tabel Riwayat Poin Customer
- **Relasi:**
  - BelongsTo: `customer`

### 14. **vouchers** - Tabel Voucher
- **Relasi:**
  - HasMany: `customerVouchers`, `orders`
  - BelongsToMany: `customers` (through customer_vouchers)

### 15. **carts** - Tabel Keranjang Belanja
- **Relasi:**
  - BelongsTo: `customer`, `product`

### 16. **customer_vouchers** - Tabel Pivot Customer-Voucher
- **Relasi:**
  - BelongsTo: `customer`, `voucher`

### 17. **promos** - Tabel Promo
- **Relasi:**
  - BelongsTo: `creator` (User)
  - HasMany: `promoStores`, `promoProducts`
  - BelongsToMany: `stores` (through promo_stores), `products` (through promo_products)

### 18. **promo_stores** - Tabel Pivot Promo-Store
- **Relasi:**
  - BelongsTo: `promo`, `store`

### 19. **promo_products** - Tabel Pivot Promo-Product
- **Relasi:**
  - BelongsTo: `promo`, `product`

### 20. **stock_movements** - Tabel Pergerakan Stok
- **Relasi:**
  - BelongsTo: `store`, `product`, `user`

### 21. **orders** - Tabel Pesanan
- **Relasi:**
  - BelongsTo: `customer`, `voucher`, `address`, `store`, `paymentMethod`
  - HasMany: `orderItems`
  - HasOne: `shipment`

### 22. **order_items** - Tabel Item Pesanan
- **Relasi:**
  - BelongsTo: `order`, `product`

### 23. **shipments** - Tabel Pengiriman
- **Relasi:**
  - BelongsTo: `order`, `shipmentMethod`
  - HasOne: `shipmentReview`
  - HasMany: `shipmentStatusMethods`

### 24. **shipment_status_method** - Tabel Status Pengiriman
- **Relasi:**
  - BelongsTo: `shipment`

### 25. **shipment_reviews** - Tabel Review Pengiriman
- **Relasi:**
  - BelongsTo: `shipment`

### 26. **order_reports** - Tabel Laporan Pesanan
- Tidak ada relasi (tabel agregat)

### 27. **order_analytics** - Tabel Analitik Pesanan
- **Relasi:**
  - BelongsTo: `product`

### 28. **customer_analytics** - Tabel Analitik Customer
- **Relasi:**
  - BelongsTo: `customer`

---

## Relasi yang Ditambahkan (Tidak Ada dalam Gambar)

Berdasarkan analisis kebutuhan sistem, berikut adalah relasi yang ditambahkan:

### 1. **User ↔ Customer & Staff** (One-to-One)
**Alasan:** User dapat menjadi customer atau staff, relasi ini diperlukan untuk authentikasi dan otorisasi.

### 2. **User ↔ Promo** (One-to-Many)
**Field:** `created_by` di tabel `promos`
**Alasan:** Tracking siapa yang membuat promo untuk audit trail.

### 3. **User ↔ StockMovement** (One-to-Many)
**Field:** `user_id` di tabel `stock_movements`
**Alasan:** Tracking siapa yang melakukan pergerakan stok untuk audit.

### 4. **User ↔ Notification** (One-to-Many)
**Field:** `from_user_id` dan `to_user_id` di tabel `notifications`
**Alasan:** Sistem notifikasi memerlukan pengirim dan penerima.

### 5. **User ↔ ActivityLog** (One-to-Many)
**Field:** `user_id` di tabel `activity_log`
**Alasan:** Log aktivitas harus terhubung dengan user untuk monitoring.

### 6. **Address ↔ Order** (One-to-Many)
**Field:** `address_id` di tabel `orders`
**Alasan:** Setiap order memerlukan alamat pengiriman.

### 7. **Order ↔ Shipment** (One-to-One)
**Alasan:** Setiap order memiliki satu pengiriman.

### 8. **Shipment ↔ ShipmentStatusMethod** (One-to-Many)
**Field:** `shipment_id` di tabel `shipment_status_method`
**Alasan:** Tracking status pengiriman secara bertahap.

---

## Cara Menjalankan Migrasi

### Opsi 1: Menggunakan Custom Artisan Command (Direkomendasikan)

```bash
# Migrasi normal dengan urutan yang benar
php artisan migrate:ordered

# Migrasi dengan drop semua table terlebih dahulu
php artisan migrate:ordered --fresh

# Migrasi dengan seeding data
php artisan migrate:ordered --seed

# Migrasi fresh + seeding
php artisan migrate:ordered --fresh --seed
```

### Opsi 2: Migrasi Manual Berurutan

Jika ingin migrasi manual, jalankan dalam urutan ini:

```bash
# Level 0: Base tables
php artisan migrate --path=database/migrations/2024_01_01_000001_create_stores_table.php
php artisan migrate --path=database/migrations/2024_01_01_000002_create_customers_table.php
php artisan migrate --path=database/migrations/2024_01_01_000003_create_staffs_table.php
php artisan migrate --path=database/migrations/2024_01_01_000004_create_product_categories_table.php
php artisan migrate --path=database/migrations/2024_01_01_000005_create_payment_methods_table.php
php artisan migrate --path=database/migrations/2024_01_01_000006_create_shipment_methods_table.php
php artisan migrate --path=database/migrations/2024_01_01_000007_create_dashboard_config_table.php
php artisan migrate --path=database/migrations/2024_01_01_000008_create_activity_log_table.php
php artisan migrate --path=database/migrations/2024_01_01_000009_create_address_table.php
php artisan migrate --path=database/migrations/2024_01_01_000010_create_notifications_table.php

# Level 1: Tables with foreign keys to level 0
php artisan migrate --path=database/migrations/2024_01_01_000011_create_products_table.php
php artisan migrate --path=database/migrations/2024_01_01_000012_create_history_points_table.php
php artisan migrate --path=database/migrations/2024_01_01_000013_create_vouchers_table.php
php artisan migrate --path=database/migrations/2024_01_01_000014_create_promos_table.php

# Level 2: Tables with foreign keys to level 1
php artisan migrate --path=database/migrations/2024_01_01_000016_create_carts_table.php
php artisan migrate --path=database/migrations/2024_01_01_000017_create_customer_vouchers_table.php
php artisan migrate --path=database/migrations/2024_01_01_000018_create_stock_movements_table.php
php artisan migrate --path=database/migrations/2024_01_01_000019_create_promo_stores_table.php
php artisan migrate --path=database/migrations/2024_01_01_000020_create_promo_products_table.php

# Level 3: Orders and related tables
php artisan migrate --path=database/migrations/2024_01_01_000021_create_orders_table.php
php artisan migrate --path=database/migrations/2024_01_01_000022_create_shipments_table.php
php artisan migrate --path=database/migrations/2024_01_01_000015_create_shipment_status_method_table.php
php artisan migrate --path=database/migrations/2024_01_01_000023_create_shipment_reviews_table.php
php artisan migrate --path=database/migrations/2024_01_01_000024_create_order_items_table.php

# Level 4: Analytics and reports
php artisan migrate --path=database/migrations/2024_01_01_000025_create_order_reports_table.php
php artisan migrate --path=database/migrations/2024_01_01_000026_create_order_analytics_table.php
php artisan migrate --path=database/migrations/2024_01_01_000027_create_customer_analytics_table.php
```

---

## Struktur File yang Dibuat

### Migrasi (27 file)
- `database/migrations/2024_01_01_000001_create_stores_table.php` sampai
- `database/migrations/2024_01_01_000027_create_customer_analytics_table.php`

### Model (29 file)
- `app/Models/Store.php`
- `app/Models/Customer.php`
- `app/Models/Staff.php`
- `app/Models/ProductCategory.php`
- `app/Models/Product.php`
- `app/Models/PaymentMethod.php`
- `app/Models/Address.php`
- `app/Models/ShipmentMethod.php`
- `app/Models/Notification.php`
- `app/Models/DashboardConfig.php`
- `app/Models/ActivityLog.php`
- `app/Models/HistoryPoint.php`
- `app/Models/Voucher.php`
- `app/Models/Cart.php`
- `app/Models/CustomerVoucher.php`
- `app/Models/Promo.php`
- `app/Models/PromoStore.php`
- `app/Models/PromoProduct.php`
- `app/Models/StockMovement.php`
- `app/Models/Order.php`
- `app/Models/OrderItem.php`
- `app/Models/Shipment.php`
- `app/Models/ShipmentReview.php`
- `app/Models/ShipmentStatusMethod.php`
- `app/Models/OrderReport.php`
- `app/Models/OrderAnalytic.php`
- `app/Models/CustomerAnalytic.php`

### Factory (15 file utama)
- `database/factories/StoreFactory.php`
- `database/factories/CustomerFactory.php`
- `database/factories/StaffFactory.php`
- `database/factories/ProductCategoryFactory.php`
- `database/factories/ProductFactory.php`
- `database/factories/PaymentMethodFactory.php`
- `database/factories/AddressFactory.php`
- `database/factories/ShipmentMethodFactory.php`
- `database/factories/VoucherFactory.php`
- `database/factories/HistoryPointFactory.php`
- `database/factories/CartFactory.php`
- `database/factories/OrderFactory.php`
- `database/factories/OrderItemFactory.php`
- `database/factories/ShipmentFactory.php`
- `database/factories/PromoFactory.php`

### Command
- `app/Console/Commands/MigrateOrderedTables.php`

---

## Contoh Penggunaan Factory

```php
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;

// Create 10 stores
Store::factory()->count(10)->create();

// Create 50 products with categories
Product::factory()->count(50)->create();

// Create orders with items
Order::factory()
    ->count(20)
    ->has(OrderItem::factory()->count(3))
    ->create();
```

---

## Diagram Entity Relationship (ERD)

Struktur hierarki relasi:

```
Level 0 (Base Tables):
- users (sudah ada)
- stores
- customers
- staffs
- product_categories
- payment_methods
- address
- shipment_methods
- notifications
- dashboard_config
- activity_log

Level 1:
- products (FK: product_category_id)
- history_points (FK: customer_id)
- vouchers
- promos (FK: created_by)

Level 2:
- carts (FK: customer_id, product_id)
- customer_vouchers (FK: customer_id, voucher_id)
- stock_movements (FK: store_id, product_id, user_id)
- promo_stores (FK: promo_id, store_id)
- promo_products (FK: promo_id, product_id)

Level 3:
- orders (FK: customer_id, voucher_id, address_id, store_id, payment_method_id)
- shipments (FK: order_id, method_id)
- shipment_status_method (FK: shipment_id)
- shipment_reviews (FK: shipment_id)
- order_items (FK: order_id, product_id)

Level 4:
- order_reports
- order_analytics (FK: product_id)
- customer_analytics (FK: customer_id)
```

---

## Notes

1. Semua migrasi menggunakan timestamp default: `created_at` dan `updated_at`
2. Foreign keys menggunakan `onDelete('cascade')` atau `onDelete('set null')` sesuai kebutuhan
3. Model sudah dilengkapi dengan relasi Eloquent yang lengkap
4. Factory sudah siap untuk generate data testing
5. Custom command `migrate:ordered` memastikan migrasi berjalan dalam urutan yang benar
