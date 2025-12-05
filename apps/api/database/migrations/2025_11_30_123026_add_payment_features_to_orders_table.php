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
        Schema::table('orders', function (Blueprint $table) {
            // Add UNIQUE constraint to code
            $table->unique('code');

            // Add customer snapshot fields
            $table->string('customer_name')->nullable()->after('code');
            $table->string('customer_email')->nullable()->after('customer_name');
            $table->string('customer_phone')->nullable()->after('customer_email');

            // Add shipping address fields
            $table->text('shipping_address')->after('customer_phone');
            $table->string('shipping_recipient_name')->nullable()->after('shipping_address');
            $table->string('shipping_recipient_phone')->nullable()->after('shipping_recipient_name');

            // Rename subtotal to sub_total for consistency
            $table->renameColumn('subtotal', 'sub_total');

            // Add admin_fee
            $table->decimal('admin_fee', 10, 2)->default(0)->after('shipping_fee');

            // Update status enum to more detailed values
            $table->enum('status', [
                'pending',      // Created, not paid
                'confirmed',    // Paid, ready to process
                'processing',   // Being processed
                'shipped',      // Shipped
                'delivered',    // Received
                'completed',    // Completed
                'cancelled',    // Cancelled
            ])->default('pending')->change();

            // Update payment_status to enum with detailed values
            $table->enum('payment_status', [
                'unpaid',
                'pending',
                'paid',
                'failed',
                'expired',
                'refunded',
            ])->default('unpaid')->change();

            // Add soft deletes for audit trail
            $table->softDeletes();

            // Make FK columns nullable first (required for nullOnDelete)
            $table->unsignedBigInteger('address_id')->nullable()->change();
            $table->unsignedBigInteger('store_id')->nullable()->change();
            $table->unsignedBigInteger('voucher_id')->nullable()->change();
            $table->unsignedBigInteger('payment_method_id')->nullable()->change();

            // Add foreign key constraints
            $table->foreign('customer_id')
                ->references('id')->on('customers')
                ->restrictOnDelete();

            $table->foreign('address_id')
                ->references('id')->on('addresses')
                ->nullOnDelete();

            $table->foreign('store_id')
                ->references('id')->on('stores')
                ->nullOnDelete();

            $table->foreign('voucher_id')
                ->references('id')->on('vouchers')
                ->nullOnDelete();

            $table->foreign('payment_method_id')
                ->references('id')->on('payment_methods')
                ->nullOnDelete();

            // Add performance indexes
            $table->index('customer_id');
            $table->index('address_id');
            $table->index('store_id');
            $table->index('voucher_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index(['status', 'payment_status']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['customer_id']);
            $table->dropForeign(['address_id']);
            $table->dropForeign(['store_id']);
            $table->dropForeign(['voucher_id']);
            $table->dropForeign(['payment_method_id']);

            // Drop indexes
            $table->dropIndex(['code']);
            $table->dropIndex(['customer_id']);
            $table->dropIndex(['address_id']);
            $table->dropIndex(['store_id']);
            $table->dropIndex(['voucher_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['status', 'payment_status']);
            $table->dropIndex(['created_at']);

            // Drop columns
            $table->dropColumn([
                'customer_name',
                'customer_email',
                'customer_phone',
                'shipping_address',
                'shipping_recipient_name',
                'shipping_recipient_phone',
                'admin_fee',
                'deleted_at',
            ]);

            // Rename back
            $table->renameColumn('sub_total', 'subtotal');
        });
    }
};
