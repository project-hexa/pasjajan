<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // va_bca, gopay, qris, etc
            $table->string('name'); // BCA Virtual Account, GoPay, etc
            $table->string('category'); // bank_transfer, e_wallet, qris, paylater
            $table->string('channel')->nullable(); // bca, bni, gopay, shopeepay
            $table->string('icon')->nullable(); // URL or filename
            $table->decimal('fee', 15, 2)->default(0); // Payment method fee
            $table->integer('min_amount')->default(0); // Minimum transaction amount
            $table->integer('max_amount')->nullable(); // Maximum transaction amount
            $table->text('description')->nullable();
            $table->boolean('is_active')->default(true); // Enable/disable
            $table->integer('display_order')->default(0); // Sorting order
            $table->timestamps();

            $table->index('code');
            $table->index('category');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
