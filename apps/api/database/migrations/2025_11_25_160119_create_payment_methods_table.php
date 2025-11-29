<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // va_bca, gopay, qris, etc
            $table->string('method_name'); // BCA Virtual Account, GoPay, etc
            $table->string('payment_type'); // bank_transfer, e_wallet, qris
            $table->string('icon')->nullable(); // URL or filename
            $table->decimal('fee', 10, 2)->default(0); // Payment method fee
            $table->integer('min_amount')->default(0); // Minimum transaction amount
            $table->integer('max_amount')->nullable(); // Maximum transaction amount
            $table->boolean('is_active')->default(true); // Enable/disable
            $table->timestamps();

            // Indexes for performance
            $table->index('code');
            $table->index('payment_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
