<?php
// database/migrations/2025_01_01_000010_create_product_pattern_analyses_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_pattern_analyses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('associated_product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('frequency')->default(0);
            $table->string('analysis_period', 20)->nullable(); // Bulanan/Tahunan
            $table->timestamps();
            $table->unique(['product_id', 'associated_product_id', 'analysis_period'], 'ppa_unique');
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('product_pattern_analyses');
    }
};
