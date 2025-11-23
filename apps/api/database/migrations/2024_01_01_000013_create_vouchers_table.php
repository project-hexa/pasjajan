<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('vouchers', function (Blueprint $table) {
      $table->id();
      $table->string('code', 50);
      $table->string('name', 50);
      $table->text('code_gcm')->nullable();
      $table->decimal('discount_value', 10, 2);
      $table->decimal('min_order_value', 10, 2)->nullable();
      $table->integer('required_points')->nullable();
      $table->date('start_date');
      $table->date('end_date');
      $table->boolean('is_active')->default(true);
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('vouchers');
  }
};
