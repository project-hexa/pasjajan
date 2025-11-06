<?php
// database/migrations/2025_01_01_000009_create_customer_analytics_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customer_analytics', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('customer_id'); // tidak ada tabel customers di modul ini
            $table->string('favorite_product', 100)->nullable();
            $table->integer('purchase_count')->default(0);
            $table->integer('transaction_frequency')->default(0);
            $table->decimal('total_spending', 15, 2)->default(0);
            $table->string('analysis_period', 20)->nullable(); // Bulanan/Tahunan
            $table->timestamps();
            $table->index('customer_id');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('customer_analytics');
    }
};
