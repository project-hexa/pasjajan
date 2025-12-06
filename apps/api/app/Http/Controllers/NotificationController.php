<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Notification;
use App\Models\User;
use App\Models\Customer;
use App\Events\NotificationSent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class NotificationController extends Controller
{
    public function metrics(Request $request): JsonResponse
    {
        $from = $request->get('from', Carbon::now()->startOfMonth());
        $to = $request->get('to', Carbon::now());

        $currentMetrics = Notification::selectRaw('COUNT(*) as total, COUNT(DISTINCT to_user_id) as active_users')
            ->whereBetween('created_at', [$from, $to])
            ->first();

        $diffInDays = Carbon::parse($from)->diffInDays(Carbon::parse($to));
        $previousFrom = Carbon::parse($from)->subDays($diffInDays);

        $previousTotal = Notification::whereBetween('created_at', [$previousFrom, $from])->count();

        $trend = $previousTotal > 0
            ? round((($currentMetrics->total - $previousTotal) / $previousTotal) * 100, 2)
            : 0;

        return ApiResponse::success(
            [
                'total_notifications' => $currentMetrics->total,
                'active_users' => $currentMetrics->active_users,
                'trend' => $trend . '%',
                'period' => [
                    'from' => $from,
                    'to' => $to
                ]
            ],
            'Data metrik notifikasi berhasil diambil'
        );
    }

    public function send(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:1000',
            'target_type' => 'required|in:all,specific,customer',
            'target_user_ids' => 'required_if:target_type,specific|array',
            'target_user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return ApiResponse::validationError($validator->errors()->toArray());
        }

        $data = $validator->validated();
        $user = Auth::user();

        if (!$user) {
            return ApiResponse::unauthorized();
        }

        try {
            $targetUsers = $this->getTargetUsers($data['target_type'], $data['target_user_ids'] ?? []);

            if (empty($targetUsers)) {
                return ApiResponse::validationError(['target_type' => 'Tidak ada user yang valid untuk target ini']);
            }

            $timestamp = now();
            $notificationsData = array_map(function ($userId) use ($data, $user, $timestamp) {
                return [
                    'title' => $data['title'],
                    'body' => $data['body'],
                    'from_user_id' => $user->id,
                    'to_user_id' => $userId,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];
            }, $targetUsers);

            Notification::insert($notificationsData);

            $insertedNotifications = Notification::with('fromUser')
                ->where('from_user_id', $user->id)
                ->where('created_at', $timestamp)
                ->get();

            foreach ($insertedNotifications as $notification) {
                broadcast(new NotificationSent($notification));
            }

            return ApiResponse::success(
                [
                    'total_recipients' => count($targetUsers),
                    'total_sent' => $insertedNotifications->count(),
                    'total_failed' => 0,
                    'status' => 'success',
                ],
                'Notifikasi berhasil dikirim'
            );
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database error saat mengirim notifikasi', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);

            return ApiResponse::serverError(
                'Gagal menyimpan notifikasi ke database',
                config('app.debug') ? ['error' => $e->getMessage()] : []
            );
        } catch (\Exception $e) {
            Log::error('Error saat mengirim notifikasi', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return ApiResponse::serverError(
                'Gagal mengirim notifikasi',
                config('app.debug') ? ['error' => $e->getMessage()] : []
            );
        }
    }

    private function getTargetUsers(string $targetType, array $specificUserIds = []): array
    {
        return match ($targetType) {
            'all' => User::pluck('id')->toArray(),
            'customer' => Customer::whereHas('user')
                ->with('user:id')
                ->get()
                ->pluck('user.id')
                ->filter()
                ->unique()
                ->values()
                ->toArray(),
            'specific' => $specificUserIds,
            default => [],
        };
    }

    public function index(Request $request): JsonResponse
    {
        $query = Notification::with(['fromUser:id,first_name,last_name,email', 'toUser:id,first_name,last_name,email']);

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        if ($request->has('from_user_id') && !empty($request->from_user_id)) {
            $query->where('from_user_id', $request->from_user_id);
        }

        if ($request->has('to_user_id') && !empty($request->to_user_id)) {
            $query->where('to_user_id', $request->to_user_id);
        }

        if ($request->has('from') && !empty($request->from)) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->has('to') && !empty($request->to)) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $query->orderBy('created_at', 'desc');

        $perPage = $request->get('per_page', config('app.pagination.per_page', 15));
        $notifications = $query->paginate($perPage);

        $notifications->getCollection()->transform(function ($notification) {
            $notification->status = 'sent';
            return $notification;
        });

        return ApiResponse::success(
            [
                'notifications' => $notifications->items(),
                'pagination' => [
                    'current_page' => $notifications->currentPage(),
                    'per_page' => $notifications->perPage(),
                    'total' => $notifications->total(),
                    'last_page' => $notifications->lastPage(),
                ]
            ],
            'Data riwayat notifikasi berhasil diambil'
        );
    }

    public function show($id): JsonResponse
    {
        $notification = Notification::with(['fromUser:id,first_name,last_name,email', 'toUser:id,first_name,last_name,email'])
            ->find($id);

        if (!$notification) {
            return ApiResponse::notFound('Notifikasi tidak ditemukan');
        }

        $notification->status = 'sent';

        return ApiResponse::success(
            ['notification' => $notification],
            'Detail notifikasi berhasil diambil'
        );
    }
}
