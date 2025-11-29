<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Customer;
use App\Models\Voucher;
use App\Models\Address;
use App\Models\Store;
use App\Models\PaymentMethod;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class)
                ->constrained()
                ->restrictOnDelete(); // Prevent delete customer if has orders

            $table->foreignIdFor(Address::class)
                ->nullable()
                ->constrained()
                ->nullOnDelete(); // Set null if address deleted

            $table->foreignIdFor(Store::class)
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignIdFor(Voucher::class)
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignIdFor(PaymentMethod::class)
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('code')->unique(); // PJ-20250103-XXXXX (business identifier)

            // Customer snapshot (untuk backup jika data dihapus)
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();

            // Shipping address snapshot
            $table->text('shipping_address');
            $table->string('shipping_recipient_name')->nullable();
            $table->string('shipping_recipient_phone')->nullable();

            // Pricing
            $table->decimal('sub_total', 10, 2); // Total before discount
            $table->decimal('discount', 10, 2)->default(0); // Voucher discount
            $table->decimal('shipping_fee', 10, 2)->default(0); // Shipping cost
            $table->decimal('admin_fee', 10, 2)->default(0); // Admin fee (optional)
            $table->decimal('grand_total', 10, 2); // Final total to pay

            // Midtrans payment integration
            $table->string('midtrans_transaction_id')->nullable()->index();
            $table->string('midtrans_order_id')->nullable();
            $table->text('payment_instructions')->nullable(); // JSON: VA number, QR, deeplink

            // Status - detailed for order lifecycle
            $table->enum('status', [
                'pending',      // Created, not paid
                'confirmed',    // Paid, ready to process
                'processing',   // Being processed (packing)
                'shipped',      // Shipped
                'delivered',    // Received by customer
                'completed',    // Completed (cannot be changed)
                'cancelled',    // Cancelled
            ])->default('pending');

            // Payment Status - detailed for payment tracking
            $table->enum('payment_status', [
                'unpaid',       // Not paid
                'pending',      // Waiting for verification
                'paid',         // Paid and verified
                'failed',       // Payment failed
                'expired',      // Payment expired
                'refunded',     // Refunded
            ])->default('unpaid');

            // Timestamps
            $table->timestamp('paid_at')->nullable(); // Payment success time
            $table->timestamp('expired_at')->nullable(); // Order expiration time
            $table->text('notes')->nullable(); // Notes from customer or admin
            $table->timestamps();
            $table->softDeletes(); // For audit trail

            // Indexes for performance
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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
