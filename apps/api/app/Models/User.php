<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
	use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

	protected $fillable = [
		'full_name',
		'phone_number',
		'email',
		'google_id',
		'password',
		'birth_date',
		'gender',
		'phone_number_verified_at',
		'avatar',
		'role',
		'remember_token',
		'status_account',
		'last_login_date',
		'reason_deleted',
	];
	
	public function otps(): HasMany
	{
		return $this->hasMany(Otp::class);
	}

	public function customer(): HasOne
	{
		return $this->hasOne(Customer::class);
	}

	public function staff(): HasOne
	{
		return $this->hasOne(Staff::class);
	}

    /** @use HasFactory<\Database\Factories\UserFactory> */
    //use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    /*protected $fillable = [
        'name',
        'email',
        'password',
	];*/

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    /*protected $hidden = [
        'password',
        'remember_token',
	];*/

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    /*protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
	}*/
}
