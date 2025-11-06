<?php
// app/Models/BroadcastMessage.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BroadcastMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'target_audience',
        'send_mode',
        'status',
        'sent_at',
        'total_recipient'
    ];

    protected $casts = ['sent_at' => 'datetime'];
}
