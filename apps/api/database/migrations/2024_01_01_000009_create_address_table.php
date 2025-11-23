<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('address', function (Blueprint $table) {
      $table->id();
      $table->string('recipient_name', 100);
      $table->string('phone_number', 15);
      $table->decimal('latitude', 10, 8);
      $table->decimal('longitude', 11, 8);
      $table->boolean('is_default')->default(false);
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('address');
  }
};
