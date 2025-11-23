<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');

            // Product reference 
            $table->unsignedBigInteger('product_id'); 

            // Product snapshot (frozen data saat order dibuat)
            $table->string('product_name');
            $table->string('product_sku')->nullable();
            $table->text('product_image_url')->nullable();

            // Pricing snapshot
            $table->decimal('price', 15, 2); // Harga satuan saat order
            $table->integer('quantity'); // Jumlah item
            $table->decimal('sub_total', 15, 2); // price * quantity

            // Optional: discount per item (jika ada)
            $table->decimal('discount', 15, 2)->default(0);

            $table->timestamps();

            // Indexes
            $table->index('order_id');
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
