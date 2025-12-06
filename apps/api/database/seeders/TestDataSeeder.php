<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    /**
     * Seed test data for payment module testing
     */
    public function run(): void
    {
        // 1. Create test user
        DB::table('users')->updateOrInsert(
            ['email' => 'customer@test.com'],
            [
                'first_name' => 'Test',
                'last_name' => 'Customer',
                'phone_number' => '081234567890',
                'username' => 'testcustomer',
                'password' => Hash::make('password'),
                'birth_date' => '1990-01-01',
                'gender' => 'Laki-Laki',
                'role' => 'Customer',
                'status_account' => 'Active',
                'last_login_date' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $userId = DB::table('users')->where('email', 'customer@test.com')->value('id');

        // 2. Create test customer
        $customer = DB::table('customers')->where('user_id', $userId)->first();

        if (!$customer) {
            $customerId = DB::table('customers')->insertGetId([
                'user_id' => $userId,
                'point' => 0,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $customerId = $customer->id;
        }

        // 3. Create test store
        DB::table('stores')->updateOrInsert(
            ['code' => 'STORE-001'],
            [
                'name' => 'Toko Test',
                'address' => 'Jl. Test No. 123, Jakarta',
                'phone_number' => '02112345678',
                'latitude' => -6.200000,
                'longitude' => 106.816666,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $storeId = DB::table('stores')->where('code', 'STORE-001')->value('id');

        // 4. Create test addresses
        $address1 = DB::table('addresses')
            ->where('customer_id', $customerId)
            ->where('label', 'Rumah')
            ->first();

        if (!$address1) {
            $address1Id = DB::table('addresses')->insertGetId([
                'customer_id' => $customerId,
                'label' => 'Rumah',
                'detail_address' => 'Jl. Kebon Jeruk No. 45, Jakarta Barat',
                'notes_address' => 'Dekat minimarket',
                'recipient_name' => 'Test Customer',
                'phone_number' => '081234567890',
                'latitude' => -6.200000,
                'longitude' => 106.816666,
                'is_default' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $address1Id = $address1->id;
        }

        $address2 = DB::table('addresses')
            ->where('customer_id', $customerId)
            ->where('label', 'Kantor')
            ->first();

        if (!$address2) {
            $address2Id = DB::table('addresses')->insertGetId([
                'customer_id' => $customerId,
                'label' => 'Kantor',
                'detail_address' => 'Jl. Sudirman No. 100, Jakarta Pusat',
                'notes_address' => 'Gedung A lantai 5',
                'recipient_name' => 'Test Customer',
                'phone_number' => '081234567890',
                'latitude' => -6.208763,
                'longitude' => 106.845599,
                'is_default' => false,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $address2Id = $address2->id;
        }

        // 5. Get or create product category - FOOD & BEVERAGE
        $category = DB::table('product_categories')->where('name', 'Food & Beverage')->first();

        if (!$category) {
            $categoryId = DB::table('product_categories')->insertGetId([
                'name' => 'Food & Beverage',
                'slug' => Str::slug('Food & Beverage'),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $categoryId = $category->id;
        }

        // 6. Create test products - RETAIL MART PRODUCTS
        $products = [
            [
                'code' => 'SNK-001',
                'product_category_id' => $categoryId,
                'name' => 'Chitato Rasa Sapi Panggang 68g',
                'description' => 'Keripik kentang rasa sapi panggang',
                'price' => 12500,
                'stock' => 50,
                'image_url' => null,
            ],
            [
                'code' => 'DRK-001',
                'product_category_id' => $categoryId,
                'name' => 'Aqua Botol 600ml',
                'description' => 'Air mineral kemasan botol',
                'price' => 5000,
                'stock' => 100,
                'image_url' => null,
            ],
            [
                'code' => 'FNB-001',
                'product_category_id' => $categoryId,
                'name' => 'Indomie Goreng Original',
                'description' => 'Mie instan goreng rasa original',
                'price' => 3500,
                'stock' => 200,
                'image_url' => null,
            ],
            [
                'code' => 'SNK-002',
                'product_category_id' => $categoryId,
                'name' => 'Oreo Original 137g',
                'description' => 'Biskuit sandwich krim vanilla',
                'price' => 15000,
                'stock' => 75,
                'image_url' => null,
            ],
            [
                'code' => 'DRK-002',
                'product_category_id' => $categoryId,
                'name' => 'Teh Pucuk Harum 350ml',
                'description' => 'Minuman teh melati kemasan botol',
                'price' => 6000,
                'stock' => 120,
                'image_url' => null,
            ],
            [
                'code' => 'SNK-003',
                'product_category_id' => $categoryId,
                'name' => 'SilverQueen Chunky Bar 100g',
                'description' => 'Cokelat susu dengan kacang dan kismis',
                'price' => 25000,
                'stock' => 40,
                'image_url' => null,
            ],
        ];

        foreach ($products as $product) {
            $exists = DB::table('products')->where('code', $product['code'])->exists();

            if (!$exists) {
                DB::table('products')->insert(array_merge($product, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
            }
        }

        $this->command->info('✅ Test data created successfully!');
        $this->command->info('');
        $this->command->info('📝 Test Credentials:');
        $this->command->info('   Email: customer@test.com');
        $this->command->info('   Username: testcustomer');
        $this->command->info('   Password: password');
        $this->command->info('');
        $this->command->info('🔑 Test IDs:');
        $this->command->info("   User ID: {$userId}");
        $this->command->info("   Customer ID: {$customerId}");
        $this->command->info("   Address ID (Rumah): {$address1Id}");
        $this->command->info("   Address ID (Kantor): {$address2Id}");
        $this->command->info("   Store ID: {$storeId}");
        $this->command->info("   Category ID: {$categoryId}");
        $this->command->info('');
        $this->command->info('🛒 Retail Products:');
        $this->command->info('   1. Chitato Sapi Panggang - Rp 12.500');
        $this->command->info('   2. Aqua 600ml - Rp 5.000');
        $this->command->info('   3. Indomie Goreng - Rp 3.500');
        $this->command->info('   4. Oreo Original - Rp 15.000');
        $this->command->info('   5. Teh Pucuk Harum - Rp 6.000');
        $this->command->info('   6. SilverQueen Chunky - Rp 25.000');
    }
}
