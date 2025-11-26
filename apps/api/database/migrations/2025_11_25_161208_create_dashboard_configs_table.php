<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Store;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dashboard_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Store::class);
            $table->string('store_name');
            $table->text('address');
            $table->string('phone');
            $table->enum('status', ['Active', 'Non-active']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_configs');
    }
};
