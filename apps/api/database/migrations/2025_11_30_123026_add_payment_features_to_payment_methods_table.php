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
        Schema::table('payment_methods', function (Blueprint $table) {
            // Add code field with unique constraint (CRITICAL!)
            $table->string('code')->unique()->after('id');

            // Add payment method icon
            $table->string('icon')->nullable()->after('payment_type');

            // Update fee default value
            $table->decimal('fee', 10, 2)->default(0)->change();

            // Add transaction limits
            $table->integer('min_amount')->default(0)->after('fee');
            $table->integer('max_amount')->nullable()->after('min_amount');

            // Add active status
            $table->boolean('is_active')->default(true)->after('max_amount');

            // Add performance indexes
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
        Schema::table('payment_methods', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['code']);
            $table->dropIndex(['payment_type']);
            $table->dropIndex(['is_active']);

            // Drop columns
            $table->dropColumn([
                'code',
                'icon',
                'min_amount',
                'max_amount',
                'is_active',
            ]);
        });
    }
};
