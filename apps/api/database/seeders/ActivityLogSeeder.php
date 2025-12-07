<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\User;
use Carbon\Carbon;

class ActivityLogSeeder extends Seeder
{
  public function run(): void
  {
    $users = User::all();

    if ($users->isEmpty()) {
      return;
    }

    $activityTypes = ['LOGIN', 'LOGOUT', 'CREATE', 'UPDATE', 'DELETE'];
    $entities = ['Product', 'Customer', 'Order', 'Branch', 'User'];

    // Generate 100 activity logs
    for ($i = 0; $i < 100; $i++) {
      $user = $users->random();
      $activityType = $activityTypes[array_rand($activityTypes)];

      // Generate description based on activity type
      $description = '';
      if ($activityType === 'LOGIN') {
        $description = "User {$user->email} berhasil login";
      } elseif ($activityType === 'LOGOUT') {
        $description = "User {$user->email} berhasil logout";
      } else {
        $entity = $entities[array_rand($entities)];
        $description = "User {$user->email} melakukan {$activityType} pada {$entity}";
      }

      // Random timestamp within the last 30 days
      $timestamp = Carbon::now()->subDays(rand(0, 30))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

      ActivityLog::create([
        'user_id' => $user->id,
        'activity_type' => $activityType,
        'description' => $description,
        'timestamp' => $timestamp,
        'ip_address' => rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255),
      ]);
    }

    // Generate specific logs for today
    for ($i = 0; $i < 20; $i++) {
      $user = $users->random();
      $activityType = $activityTypes[array_rand($activityTypes)];

      $description = '';
      if ($activityType === 'LOGIN') {
        $description = "User {$user->email} berhasil login";
      } elseif ($activityType === 'LOGOUT') {
        $description = "User {$user->email} berhasil logout";
      } else {
        $entity = $entities[array_rand($entities)];
        $description = "User {$user->email} melakukan {$activityType} pada {$entity}";
      }

      $timestamp = Carbon::today()->addHours(rand(0, 23))->addMinutes(rand(0, 59));

      ActivityLog::create([
        'user_id' => $user->id,
        'activity_type' => $activityType,
        'description' => $description,
        'timestamp' => $timestamp,
        'ip_address' => rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255) . '.' . rand(1, 255),
      ]);
    }
  }
}
