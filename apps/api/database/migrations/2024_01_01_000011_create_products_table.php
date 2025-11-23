<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::create('products', function (Blueprint $table) {
      $table->id();
      $table->unsignedBigInteger('product_category_id');
      $table->string('name', 255);
      $table->string('code', 50);
      $table->text('description');
      $table->decimal('price', 10, 2);
      $table->integer('stock');
      $table->string('image_url', 255);
      $table->timestamp('created_at')->useCurrent();
      $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

      $table->foreign('product_category_id')->references('id')->on('product_categories')->onDelete('cascade');
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('products');
  }
};
