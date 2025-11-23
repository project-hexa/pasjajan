<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('stores', function (Blueprint $table) {
      $table->id();
      $table->string('code', 10)->unique();
      $table->string('name', 100);
      $table->text('address');
      $table->string('phone_number', 15);
      $table->decimal('latitude', 10, 8);
      $table->decimal('longitude', 11, 8);
      $table->boolean('is_active')->default(true);
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('stores');
  }
};
