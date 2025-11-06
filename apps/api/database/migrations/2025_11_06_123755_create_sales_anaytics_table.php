<?php
// database/migrations/2025_01_01_000008_create_sales_analytics_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->date('start_period');
            $table->date('end_period');
            $table->integer('total_sold')->default(0);
            $table->string('sales_trend', 20)->nullable(); // naik/turun/stabil
            $table->integer('sales_rank')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('sales_analytics');
    }
};
