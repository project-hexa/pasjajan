<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Store;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Store::class);
            $table->foreignIdFor(Product::class);
            $table->integer('quantity_change');
            $table->enum('movement_type', ['sale', 'delivery', 'correction']);
            $table->foreignIdFor(Order::class)->nullable();
            $table->foreignIdFor(User::class)->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
