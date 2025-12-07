<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProductCategory;

class ProductCategorySeeder extends Seeder
{
  public function run(): void
  {
    $categories = [
      ['name' => 'Elektronik', 'slug' => 'elektronik'],
      ['name' => 'Fashion', 'slug' => 'fashion'],
      ['name' => 'Makanan & Minuman', 'slug' => 'makanan-minuman'],
      ['name' => 'Kesehatan & Kecantikan', 'slug' => 'kesehatan-kecantikan'],
      ['name' => 'Rumah Tangga', 'slug' => 'rumah-tangga'],
      ['name' => 'Olahraga', 'slug' => 'olahraga'],
      ['name' => 'Otomotif', 'slug' => 'otomotif'],
      ['name' => 'Buku & Alat Tulis', 'slug' => 'buku-alat-tulis'],
    ];

    foreach ($categories as $category) {
      ProductCategory::create($category);
    }
  }
}
