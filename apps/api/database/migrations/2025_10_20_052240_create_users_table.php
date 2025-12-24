<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('email')->unique();
            $table->string('phone_number')->unique();
			$table->string('google_id')->unique()->nullable();
            $table->string('password');
            $table->date('birth_date')->nullable();
            $table->enum('gender', ['Laki-Laki', 'Perempuan'])->nullable();
            $table->dateTime('phone_number_verified_at')->nullable();
            $table->dateTime('email_verified_at')->nullable();
            $table->string('avatar')->nullable(); // URL/path to user's profile photo
			$table->enum('role', ['Staff', 'Admin', 'Customer'])->default('Customer');
			$table->string('remember_token')->nullable();
            $table->enum('status_account', ['Active', 'Inactive', 'Pending'])->default('Active');
            $table->timestamp('last_login_date');
            $table->text('reason_deleted')->nullable();
            $table->timestamps();
            $table->softDeletes('deleted_at')->nullable();
			/*
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
			 */
        });

		/*
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
		*/

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
