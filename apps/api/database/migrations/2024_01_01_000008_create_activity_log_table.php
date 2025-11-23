<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('activity_log', function (Blueprint $table) {
      $table->id();
      $table->integer('user_id');
      $table->string('activity_type', 50);
      $table->text('description');
      $table->dateTime('timestamp')->useCurrent();
      $table->string('ip_address', 45)->nullable();
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('activity_log');
  }
};
