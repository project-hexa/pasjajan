<?php
// database/migrations/2025_01_01_000005_create_sales_reports_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('sales_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users');
            $table->foreignId('branch_id')->constrained('branches');
            $table->date('start_period');
            $table->date('end_period');
            $table->decimal('total_sales', 15, 2)->default(0);
            $table->integer('transaction_count')->default(0);
            $table->integer('total_products_sold')->default(0);
            $table->string('export_file', 255)->nullable();
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('sales_reports');
    }
};
