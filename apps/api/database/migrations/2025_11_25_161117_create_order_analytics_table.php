<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('order_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Product::class);
            $table->date('start_period');
            $table->date('end_period');
            $table->integer('total_sold');
            $table->string('sales_trend');
            $table->integer('sales_rank');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_analytics');
    }
};
