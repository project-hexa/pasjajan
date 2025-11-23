<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('dashboard_config', function (Blueprint $table) {
      $table->id();
      $table->integer('store_id');
      $table->string('store_name', 100);
      $table->text('address');
      $table->string('phone', 20);
      $table->enum('status', ['active', 'inactive'])->default('active');
      $table->dateTime('created_at')->useCurrent();
      $table->dateTime('updated_at')->useCurrent();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('dashboard_config');
  }
};
