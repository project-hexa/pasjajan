<?php
// database/migrations/2025_01_01_000006_create_branch_stocks_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('branch_stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->foreignId('branch_id')->constrained('branches')->cascadeOnDelete();
            $table->integer('current_stock')->default(0);
            $table->dateTime('last_update')->nullable();
            $table->enum('update_mode', ['otomatis', 'manual'])->default('manual');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
            $table->unique(['product_id', 'branch_id']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('branch_stocks');
    }
};
