<?php
// database/migrations/2025_01_01_000004_create_sales_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->date('sale_date');
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('quantity_sold');
            $table->decimal('total_price', 15, 2);
            $table->string('payment_method', 50);
            $table->foreignId('admin_id')->constrained('users');
            $table->foreignId('branch_id')->constrained('branches');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
