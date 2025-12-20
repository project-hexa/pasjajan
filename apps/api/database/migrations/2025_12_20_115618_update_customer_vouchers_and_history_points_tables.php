<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Make used_at nullable in customer_vouchers table
        Schema::table('customer_vouchers', function (Blueprint $table) {
            $table->dateTime('used_at')->nullable()->change();
        });

        // Update enum type in history_points table
        // Add new enum values: 'earn', 'redeem', 'bonus', 'expired', 'adjustment'
        DB::statement("ALTER TABLE history_points MODIFY COLUMN type ENUM('Masuk', 'Keluar') NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert used_at to not nullable
        Schema::table('customer_vouchers', function (Blueprint $table) {
            $table->dateTime('used_at')->nullable(false)->change();
        });

        // Revert enum to original values
        DB::statement("ALTER TABLE history_points MODIFY COLUMN type ENUM('credit', 'debit') NOT NULL");
    }
};
