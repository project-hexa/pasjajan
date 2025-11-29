<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductCategory;

class ProductSeeder extends Seeder
{
  public function run(): void
  {
    $categories = ProductCategory::all();

    $products = [
      ['name' => 'Smartphone Samsung Galaxy', 'price' => 5000000, 'stock' => 50, 'category_id' => 1],
      ['name' => 'Laptop ASUS ROG', 'price' => 15000000, 'stock' => 20, 'category_id' => 1],
      ['name' => 'Smart TV 43 inch', 'price' => 4500000, 'stock' => 30, 'category_id' => 1],
      ['name' => 'Wireless Earbuds', 'price' => 500000, 'stock' => 100, 'category_id' => 1],
      ['name' => 'Power Bank 20000mAh', 'price' => 250000, 'stock' => 80, 'category_id' => 1],

      ['name' => 'Kaos Polos Premium', 'price' => 150000, 'stock' => 200, 'category_id' => 2],
      ['name' => 'Celana Jeans', 'price' => 350000, 'stock' => 150, 'category_id' => 2],
      ['name' => 'Jaket Hoodie', 'price' => 250000, 'stock' => 100, 'category_id' => 2],
      ['name' => 'Sepatu Sneakers', 'price' => 450000, 'stock' => 80, 'category_id' => 2],
      ['name' => 'Tas Ransel', 'price' => 200000, 'stock' => 120, 'category_id' => 2],

      ['name' => 'Kopi Arabica Premium 250g', 'price' => 75000, 'stock' => 300, 'category_id' => 3],
      ['name' => 'Cokelat Bar 100g', 'price' => 25000, 'stock' => 500, 'category_id' => 3],
      ['name' => 'Mie Instan Pack 10', 'price' => 50000, 'stock' => 400, 'category_id' => 3],
      ['name' => 'Teh Celup Premium 25s', 'price' => 35000, 'stock' => 350, 'category_id' => 3],
      ['name' => 'Susu UHT 1 Liter', 'price' => 18000, 'stock' => 600, 'category_id' => 3],

      ['name' => 'Vitamin C 1000mg', 'price' => 120000, 'stock' => 150, 'category_id' => 4],
      ['name' => 'Hand & Body Lotion', 'price' => 45000, 'stock' => 200, 'category_id' => 4],
      ['name' => 'Facial Wash', 'price' => 35000, 'stock' => 250, 'category_id' => 4],
      ['name' => 'Shampoo Anti Dandruff', 'price' => 40000, 'stock' => 180, 'category_id' => 4],
      ['name' => 'Masker Wajah 10 Sheet', 'price' => 50000, 'stock' => 160, 'category_id' => 4],

      ['name' => 'Panci Set Stainless', 'price' => 350000, 'stock' => 60, 'category_id' => 5],
      ['name' => 'Rice Cooker 1.8L', 'price' => 450000, 'stock' => 50, 'category_id' => 5],
      ['name' => 'Blender 2 Liter', 'price' => 300000, 'stock' => 40, 'category_id' => 5],
      ['name' => 'Setrika Uap', 'price' => 250000, 'stock' => 55, 'category_id' => 5],

      ['name' => 'Matras Yoga', 'price' => 150000, 'stock' => 80, 'category_id' => 6],
      ['name' => 'Dumbell Set 5kg', 'price' => 200000, 'stock' => 60, 'category_id' => 6],
      ['name' => 'Sepeda Lipat', 'price' => 2500000, 'stock' => 25, 'category_id' => 6],
      ['name' => 'Raket Badminton', 'price' => 300000, 'stock' => 45, 'category_id' => 6],

      ['name' => 'Helm Full Face', 'price' => 600000, 'stock' => 40, 'category_id' => 7],
      ['name' => 'Cover Motor', 'price' => 75000, 'stock' => 100, 'category_id' => 7],
      ['name' => 'Oli Mesin 1 Liter', 'price' => 50000, 'stock' => 200, 'category_id' => 7],

      ['name' => 'Novel Bestseller', 'price' => 85000, 'stock' => 150, 'category_id' => 8],
      ['name' => 'Buku Tulis A5 10 Pack', 'price' => 40000, 'stock' => 300, 'category_id' => 8],
      ['name' => 'Pulpen Set 12 Warna', 'price' => 25000, 'stock' => 250, 'category_id' => 8],
      ['name' => 'Pensil Warna 24 Warna', 'price' => 35000, 'stock' => 200, 'category_id' => 8],
    ];

    foreach ($products as $index => $productData) {
      Product::create([
        'name' => $productData['name'],
        'code' => 'PRD' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
        'price' => $productData['price'],
        'stock' => $productData['stock'],
        'product_category_id' => $productData['category_id'],
        'description' => 'Deskripsi untuk ' . $productData['name'],
      ]);
    }
  }
}
