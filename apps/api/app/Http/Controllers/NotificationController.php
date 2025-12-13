<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Notification;
use App\Models\User;
use App\Models\Customer;
use App\Mail\NotificationMail;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class NotificationController extends Controller
{
    public function metrics(Request $request): JsonResponse
    {
        $from = $request->get('from', Carbon::now()->startOfMonth());
        $to = $request->get('to', Carbon::now());

        // Current period metrics
        $currentMetrics = Notification::selectRaw('COUNT(*) as total, COUNT(DISTINCT to_user_id) as active_users')
            ->whereBetween('created_at', [$from, $to])
            ->first();

        // Previous period calculation
        $diffInDays = Carbon::parse($from)->diffInDays(Carbon::parse($to));
        $previousFrom = Carbon::parse($from)->subDays($diffInDays);

        $previousMetrics = Notification::selectRaw('COUNT(*) as total, COUNT(DISTINCT to_user_id) as active_users')
            ->whereBetween('created_at', [$previousFrom, $from])
            ->first();

        // Calculate trend for total notifications
        if ($previousMetrics->total > 0) {
            $notificationsTrend = round((($currentMetrics->total - $previousMetrics->total) / $previousMetrics->total) * 100, 2);
        } elseif ($currentMetrics->total > 0) {
            $notificationsTrend = 100;
        } else {
            $notificationsTrend = 0;
        }

        // Calculate trend for active users
        if ($previousMetrics->active_users > 0) {
            $activeUsersTrend = round((($currentMetrics->active_users - $previousMetrics->active_users) / $previousMetrics->active_users) * 100, 2);
        } elseif ($currentMetrics->active_users > 0) {
            $activeUsersTrend = 100;
        } else {
            $activeUsersTrend = 0;
        }

        // Determine trend direction and description
        $notificationsTrendText = $notificationsTrend > 0 ? '+' . $notificationsTrend : $notificationsTrend;
        $activeUsersTrendText = $activeUsersTrend > 0 ? '+' . $activeUsersTrend : $activeUsersTrend;

        return ApiResponse::success(
            [
                'total_notifications' => [
                    'value' => $currentMetrics->total,
                    'trend' => $notificationsTrendText . '%',
                    'description' => 'Trending naik bulan ini'
                ],
                'active_users' => [
                    'value' => $currentMetrics->active_users,
                    'trend' => $activeUsersTrendText . '%',
                    'description' => 'Pengguna aktif 6 bulan terakhir'
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
            // Langsung kirim ke semua customer
            $customers = $this->getCustomers();

            if ($customers->isEmpty()) {
                return ApiResponse::validationError(['message' => 'Tidak ada customer yang ditemukan']);
            }

            $timestamp = now();
            $notificationsData = [];
            $emailsSent = 0;
            $emailsFailed = 0;

            foreach ($customers as $customer) {
                // Simpan ke database
                $notificationsData[] = [
                    'title' => $data['title'],
                    'body' => $data['body'],
                    'from_user_id' => $user->id,
                    'to_user_id' => $customer->user_id,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];

                // Kirim email
                try {
                    Mail::to($customer->user->email)->send(
                        new NotificationMail(
                            $data['title'],
                            $data['body'],
                            $user->full_name
                        )
                    );
                    $emailsSent++;
                } catch (\Exception $mailError) {
                    Log::error('Gagal mengirim email ke: ' . $customer->user->email, [
                        'error' => $mailError->getMessage()
                    ]);
                    $emailsFailed++;
                }
            }

            // Simpan semua notifikasi ke database
            if (!empty($notificationsData)) {
                Notification::insert($notificationsData);
            }

            return ApiResponse::success(
                [
                    'total_recipients' => $customers->count(),
                    'total_sent' => $emailsSent,
                    'total_failed' => $emailsFailed,
                    'status' => $emailsSent > 0 ? 'success' : 'failed',
                ],
                'Notifikasi berhasil dikirim via email'
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

    /**
     * Get all customers with user relationship
     */
    private function getCustomers()
    {
        return Customer::whereHas('user')
            ->with('user:id,full_name,email')
            ->get();
    }

    public function index(Request $request): JsonResponse
    {
        $query = Notification::with(['fromUser:id,full_name,email', 'toUser:id,full_name,email']);

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
        $notification = Notification::with(['fromUser:id,full_name,email', 'toUser:id,full_name,email'])
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
