<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
  /**
   * Log activity to database
   * 
   * @param string $activityType Type of activity (CREATE, UPDATE, DELETE, LOGIN, LOGOUT, etc)
   * @param string $description Description of the activity
   * @param int|null $userId Optional user ID (for login before auth)
   * @return void
   */
  protected function logActivity(string $activityType, string $description, ?int $userId = null): void
  {
    $user = $userId ? \App\Models\User::find($userId) : Auth::user();

    if (!$user) {
      return;
    }

    ActivityLog::create([
      'user_id' => $user->id,
      'activity_type' => $activityType,
      'description' => $description,
      'timestamp' => now(),
      'ip_address' => request()->ip(),
    ]);
  }
}
