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
        Schema::table('notifications', function (Blueprint $table) {
            $table->string('type')->default('general')->after('body');
            $table->string('related_id')->nullable()->after('type'); // Stores Order ID / Shipment ID
            $table->json('data')->nullable()->after('related_id'); // Flexible data storage

            // Index for faster queries
            $table->index(['to_user_id', 'type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['to_user_id', 'type']);
            $table->dropColumn(['type', 'related_id', 'data']);
        });
    }
};
