<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('promos', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('discount_value', total: 10, places: 2);
            $table->decimal('min_order_value', total: 10, places: 2);
            $table->date('start_date');
            $table->date('end_date');
            $table->enum('status', ['Active', 'Non-active']);
            $table->enum('applies_to', ['All', 'Specific']);
            $table->enum('applies_to_product', ['All', 'Specific']);
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('promos');
    }
};
