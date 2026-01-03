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
      // Makanan & Minuman
      ['name' => 'Indomie Goreng', 'price' => 3500, 'stock' => 500, 'category_id' => 3],
      ['name' => 'Mie Sedaap Kari Spesial', 'price' => 3000, 'stock' => 450, 'category_id' => 3],
      ['name' => 'Pop Mie Rasa Ayam', 'price' => 6500, 'stock' => 300, 'category_id' => 3],
      ['name' => 'Beras Premium 5kg', 'price' => 75000, 'stock' => 100, 'category_id' => 3],
      ['name' => 'Minyak Goreng 2L', 'price' => 32000, 'stock' => 150, 'category_id' => 3],
      ['name' => 'Gula Pasir 1kg', 'price' => 15000, 'stock' => 200, 'category_id' => 3],
      ['name' => 'Kopi Kapal Api Special Mix', 'price' => 14000, 'stock' => 250, 'category_id' => 3],
      ['name' => 'Teh Celup Sosro 25s', 'price' => 12000, 'stock' => 300, 'category_id' => 3],
      ['name' => 'Susu UHT Ultra Milk 1L', 'price' => 18000, 'stock' => 200, 'category_id' => 3],
      ['name' => 'Aqua Botol 600ml', 'price' => 4000, 'stock' => 600, 'category_id' => 3],
      ['name' => 'Coca Cola 1.5L', 'price' => 12000, 'stock' => 180, 'category_id' => 3],
      ['name' => 'Teh Botol Sosro 450ml', 'price' => 5000, 'stock' => 400, 'category_id' => 3],
      ['name' => 'Biskuit Roma Kelapa', 'price' => 8000, 'stock' => 350, 'category_id' => 3],
      ['name' => 'Oreo Original', 'price' => 11000, 'stock' => 280, 'category_id' => 3],
      ['name' => 'Chitato Rasa Sapi Panggang', 'price' => 12000, 'stock' => 320, 'category_id' => 3],
      ['name' => 'Permen Kopiko', 'price' => 7500, 'stock' => 400, 'category_id' => 3],
      ['name' => 'Wafer Tango Coklat', 'price' => 6500, 'stock' => 300, 'category_id' => 3],
      ['name' => 'Roti Tawar Sari Roti', 'price' => 13000, 'stock' => 150, 'category_id' => 3],
      ['name' => 'Telur Ayam 1kg', 'price' => 28000, 'stock' => 120, 'category_id' => 3],
      ['name' => 'Margarin Blue Band 200g', 'price' => 15000, 'stock' => 180, 'category_id' => 3],
      ['name' => 'Kecap Manis Bango 220ml', 'price' => 12000, 'stock' => 250, 'category_id' => 3],
      ['name' => 'Saus Sambal ABC 340ml', 'price' => 16000, 'stock' => 220, 'category_id' => 3],
      ['name' => 'Susu Kental Manis 370g', 'price' => 13000, 'stock' => 280, 'category_id' => 3],
      ['name' => 'Milo Sachet 10s', 'price' => 18000, 'stock' => 200, 'category_id' => 3],
      ['name' => 'Energen Coklat 10s', 'price' => 14000, 'stock' => 190, 'category_id' => 3],

      // Kebersihan & Perawatan
      ['name' => 'Sabun Lifebuoy 90g', 'price' => 6000, 'stock' => 350, 'category_id' => 4],
      ['name' => 'Shampoo Pantene 170ml', 'price' => 24000, 'stock' => 200, 'category_id' => 4],
      ['name' => 'Pasta Gigi Pepsodent 190g', 'price' => 16000, 'stock' => 280, 'category_id' => 4],
      ['name' => 'Sikat Gigi Formula', 'price' => 8000, 'stock' => 250, 'category_id' => 4],
      ['name' => 'Sabun Cuci Piring Sunlight 750ml', 'price' => 18000, 'stock' => 220, 'category_id' => 4],
      ['name' => 'Deterjen Rinso 900g', 'price' => 28000, 'stock' => 180, 'category_id' => 4],
      ['name' => 'Pewangi Pakaian Molto 900ml', 'price' => 22000, 'stock' => 160, 'category_id' => 4],
      ['name' => 'Tissue Paseo 250s', 'price' => 16000, 'stock' => 300, 'category_id' => 4],
      ['name' => 'Pembalut Charm 16s', 'price' => 18000, 'stock' => 200, 'category_id' => 4],
      ['name' => 'Sabun Mandi Cair Dettol 250ml', 'price' => 28000, 'stock' => 150, 'category_id' => 4],
      ['name' => 'Deodorant Rexona Roll On', 'price' => 22000, 'stock' => 180, 'category_id' => 4],
      ['name' => 'Shampo Sachet Clear 12ml', 'price' => 2500, 'stock' => 500, 'category_id' => 4],
      ['name' => 'Sabun Cuci Tangan Lifebuoy 250ml', 'price' => 16000, 'stock' => 190, 'category_id' => 4],

      // Perlengkapan Rumah Tangga
      ['name' => 'Pembersih Lantai Kispray 800ml', 'price' => 15000, 'stock' => 150, 'category_id' => 5],
      ['name' => 'Karbol Sereh Wipol 800ml', 'price' => 18000, 'stock' => 140, 'category_id' => 5],
      ['name' => 'Pengharum Ruangan Stella 400ml', 'price' => 22000, 'stock' => 120, 'category_id' => 5],
      ['name' => 'Kantong Plastik Kresek Hitam', 'price' => 12000, 'stock' => 200, 'category_id' => 5],
      ['name' => 'Korek Api Gas Clipper', 'price' => 8000, 'stock' => 250, 'category_id' => 5],
      ['name' => 'Baygon Spray 600ml', 'price' => 35000, 'stock' => 100, 'category_id' => 5],
      ['name' => 'Sabun Colek Ekonomi 400g', 'price' => 8000, 'stock' => 180, 'category_id' => 5],
      ['name' => 'Lap Microfiber', 'price' => 15000, 'stock' => 150, 'category_id' => 5],

      // Kebutuhan Bayi & Anak
      ['name' => 'Popok Bayi Merries M 34s', 'price' => 125000, 'stock' => 80, 'category_id' => 4],
      ['name' => 'Susu Formula SGM 400g', 'price' => 58000, 'stock' => 100, 'category_id' => 3],
      ['name' => 'Baby Oil Cussons 100ml', 'price' => 24000, 'stock' => 120, 'category_id' => 4],
      ['name' => 'Bedak Bayi My Baby 100g', 'price' => 18000, 'stock' => 140, 'category_id' => 4],

      // Alat Tulis & Perlengkapan Kantor
      ['name' => 'Pulpen Standard AE7', 'price' => 2000, 'stock' => 400, 'category_id' => 8],
      ['name' => 'Buku Tulis Sinar Dunia 58 Lembar', 'price' => 5000, 'stock' => 350, 'category_id' => 8],
      ['name' => 'Pensil 2B Faber Castell', 'price' => 3000, 'stock' => 300, 'category_id' => 8],
      ['name' => 'Penghapus Karet Steadtler', 'price' => 4000, 'stock' => 280, 'category_id' => 8],
      ['name' => 'Lem Kertas Povinal 125ml', 'price' => 6000, 'stock' => 200, 'category_id' => 8],

      // Lain-lain
      ['name' => 'Masker Sensi 3ply isi 10', 'price' => 15000, 'stock' => 250, 'category_id' => 4],
      ['name' => 'Hand Sanitizer 100ml', 'price' => 12000, 'stock' => 300, 'category_id' => 4],
      ['name' => 'Baterai ABC AA 4s', 'price' => 16000, 'stock' => 180, 'category_id' => 1],
      ['name' => 'Kabel Data Micro USB', 'price' => 15000, 'stock' => 150, 'category_id' => 1],
      ['name' => 'Pulsa Listrik Token 50k', 'price' => 51000, 'stock' => 500, 'category_id' => 1],
    ];

    foreach ($products as $index => $productData) {
      Product::create([
        'name' => $productData['name'],
        'code' => 'PRD' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
        'price' => $productData['price'],
        'stock' => $productData['stock'],
        'product_category_id' => $productData['category_id'],
        'description' => 'Deskripsi untuk ' . $productData['name'],
        'image_url' => $productData['image_url'],
      ]);
    }
  }
}
