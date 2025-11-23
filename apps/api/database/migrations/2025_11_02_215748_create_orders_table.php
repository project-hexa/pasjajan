<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // PJ-20250103-XXXXX (business identifier)

            // Foreign Keys (references to other modules)
            $table->unsignedBigInteger('customer_id'); // Reference ke user/customer
            $table->unsignedBigInteger('address_id')->nullable(); // Reference ke address
            $table->unsignedBigInteger('store_id')->nullable(); // Reference ke store/merchant
            $table->unsignedBigInteger('voucher_id')->nullable(); // Reference ke voucher
            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->nullOnDelete();

            // Customer snapshot (untuk backup jika data dihapus)
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();

            // Shipping address snapshot
            $table->text('shipping_address');
            $table->string('shipping_recipient_name')->nullable();
            $table->string('shipping_recipient_phone')->nullable();

            // Pricing
            $table->decimal('sub_total', 15, 2); // Total harga items sebelum diskon
            $table->decimal('discount', 15, 2)->default(0); // Diskon dari voucher
            $table->decimal('shipping_fee', 15, 2)->default(0); // Ongkos kirim
            $table->decimal('tax_amount', 15, 2)->default(0); // Pajak (optional)
            $table->decimal('admin_fee', 15, 2)->default(0); // Biaya admin (optional)
            $table->decimal('grand_total', 15, 2); // Total akhir yang dibayar

            // Midtrans payment data
            $table->string('midtrans_transaction_id')->nullable()->index();
            $table->string('midtrans_order_id')->nullable();
            $table->text('payment_instructions')->nullable(); // JSON: VA number, QR, deeplink

            // Status
            $table->enum('status', [
                'pending',      // Baru dibuat, belum bayar
                'confirmed',    // Sudah bayar, siap diproses
                'processing',   // Sedang diproses (packing)
                'shipped',      // Sudah dikirim
                'delivered',    // Sudah diterima customer
                'completed',    // Selesai (tidak bisa diubah lagi)
                'cancelled',    // Dibatalkan
            ])->default('pending');

            $table->enum('payment_status', [
                'unpaid',       // Belum bayar
                'pending',      // Menunggu verifikasi pembayaran
                'paid',         // Sudah dibayar dan verified
                'failed',       // Pembayaran gagal
                'expired',      // Pembayaran kadaluarsa
                'refunded',     // Di-refund
            ])->default('unpaid');

            // Timestamps
            $table->timestamp('paid_at')->nullable(); // Waktu pembayaran sukses
            $table->timestamp('expired_at')->nullable(); // Waktu kadaluarsa order
            $table->text('notes')->nullable(); // Catatan dari customer atau admin
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('customer_id');
            $table->index('address_id');
            $table->index('store_id');
            $table->index('voucher_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index(['status', 'payment_status']); // Composite index
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
