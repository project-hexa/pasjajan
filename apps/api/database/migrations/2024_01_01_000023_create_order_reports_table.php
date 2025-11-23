<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('order_reports', function (Blueprint $table) {
      $table->id();
      $table->date('start_period');
      $table->date('end_period');
      $table->decimal('total_sales', 15, 2);
      $table->integer('transaction_count');
      $table->integer('total_products_sold');
      $table->string('export_file', 255)->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('order_reports');
  }
};
