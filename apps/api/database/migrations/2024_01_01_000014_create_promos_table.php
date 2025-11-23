<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('promos', function (Blueprint $table) {
      $table->id();
      $table->string('name', 255);
      $table->text('description');
      $table->decimal('discount_value', 10, 2);
      $table->decimal('min_order_value', 10, 2);
      $table->date('start_date');
      $table->date('end_date');
      $table->enum('status', ['active', 'inactive'])->default('active');
      $table->enum('applies_to', ['all', 'specific'])->nullable();
      $table->enum('applies_to_product', ['all', 'specific'])->nullable();
      $table->unsignedBigInteger('created_by');
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('promos');
  }
};
