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
        Schema::table('order_items', function (Blueprint $table) {
            // Rename subtotal to sub_total for consistency
            $table->renameColumn('subtotal', 'sub_total');

            // Add foreign key constraints
            $table->foreign('order_id')
                ->references('id')->on('orders')
                ->cascadeOnDelete();

            $table->foreign('product_id')
                ->references('id')->on('products')
                ->restrictOnDelete();

            // Add performance indexes
            $table->index('order_id');
            $table->index('product_id');
            $table->index(['order_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            // Drop foreign keys
            $table->dropForeign(['order_id']);
            $table->dropForeign(['product_id']);

            // Drop indexes
            $table->dropIndex(['order_id']);
            $table->dropIndex(['product_id']);
            $table->dropIndex(['order_id', 'product_id']);

            // Rename back
            $table->renameColumn('sub_total', 'subtotal');
        });
    }
};
