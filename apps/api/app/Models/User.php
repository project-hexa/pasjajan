<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'phone_number',
        'username',
        'password',
        'birth_date',
        'gender',
        'phone_number_verified_at',
        'avatar',
        'role',
        'status_account',
        'last_login_date',
        'reason_deleted',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'phone_number_verified_at' => 'datetime',
            'birth_date' => 'date',
            'last_login_date' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    public function staff()
    {
        return $this->hasOne(Staff::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'to_user_id');
    }

    public function sentNotifications()
    {
        return $this->hasMany(Notification::class, 'from_user_id');
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function createdPromos()
    {
        return $this->hasMany(Promo::class, 'created_by');
    }
}
