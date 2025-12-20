<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Mail\NotificationMail;
use App\Models\Customer;
use App\Models\Notification;
use App\Traits\LogsActivity;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    use LogsActivity;

    public function metrics(Request $request): JsonResponse
    {
        $from = $request->get('from', Carbon::now()->startOfMonth());
        $to = $request->get('to', Carbon::now());

        $currentMetrics = Notification::selectRaw('COUNT(*) as total, COUNT(DISTINCT to_user_id) as active_users')
            ->whereBetween('created_at', [$from, $to])
            ->first();

        $diffInDays = Carbon::parse($from)->diffInDays(Carbon::parse($to));
        $previousFrom = Carbon::parse($from)->subDays($diffInDays);

        $previousMetrics = Notification::selectRaw('COUNT(*) as total, COUNT(DISTINCT to_user_id) as active_users')
            ->whereBetween('created_at', [$previousFrom, $from])
            ->first();

        $notificationsTrend = $this->calculateTrend($previousMetrics->total, $currentMetrics->total);
        $activeUsersTrend = $this->calculateTrend($previousMetrics->active_users, $currentMetrics->active_users);

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
            $customers = $this->getCustomers();

            if ($customers->isEmpty()) {
                return ApiResponse::validationError(['message' => 'Tidak ada customer yang ditemukan']);
            }

            $timestamp = now();
            $notificationsData = [];
            $emailsSent = 0;
            $emailsFailed = 0;
            $recipientEmails = [];

            foreach ($customers as $customer) {
                $notificationsData[] = [
                    'title' => $data['title'],
                    'body' => $data['body'],
                    'from_user_id' => $user->id,
                    'to_user_id' => $customer->user_id,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ];

                try {
                    Mail::to($customer->user->email)->send(
                        new NotificationMail($data['title'], $data['body'], $user->full_name)
                    );
                    $emailsSent++;
                    $recipientEmails[] = $customer->user->email;
                } catch (\Exception $mailError) {
                    $emailsFailed++;
                    Log::error('Gagal mengirim email notifikasi', [
                        'to' => $customer->user->email,
                        'customer_name' => $customer->user->full_name,
                        'error' => $mailError->getMessage()
                    ]);
                }
            }

            if (!empty($notificationsData)) {
                Notification::insert($notificationsData);
            }

            $statusText = $emailsSent > 0 ? 'berhasil' : 'gagal';
            $recipientPreview = $this->formatRecipientPreview($recipientEmails, $customers->count());

            $this->logActivity(
                'SEND_NOTIFICATION',
                "Pengiriman notifikasi '{$data['title']}' {$statusText}. Terkirim: {$emailsSent}/{$customers->count()} email. Recipients: {$recipientPreview}"
            );

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

            $this->logActivity(
                'SEND_NOTIFICATION',
                "Gagal mengirim notifikasi '{$data['title']}': Database error"
            );

            return ApiResponse::serverError(
                'Gagal menyimpan notifikasi ke database',
                config('app.debug') ? ['error' => $e->getMessage()] : []
            );
        } catch (\Exception $e) {
            Log::error('Error saat mengirim notifikasi', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            $this->logActivity(
                'SEND_NOTIFICATION',
                "Gagal mengirim notifikasi: {$e->getMessage()}"
            );

            return ApiResponse::serverError(
                'Gagal mengirim notifikasi',
                config('app.debug') ? ['error' => $e->getMessage()] : []
            );
        }
    }

    public function index(Request $request): JsonResponse
    {
        $query = Notification::with(['fromUser:id,full_name,email', 'toUser:id,full_name,email']);

        $this->applyFilters($query, $request);

        $query->orderBy('created_at', 'desc');

        $perPage = $request->get('per_page', config('app.pagination.per_page', 15));
        $allNotifications = $query->get();

        $grouped = $allNotifications->groupBy(function ($item) {
            return $item->created_at . '|' . $item->from_user_id . '|' . $item->title . '|' . $item->body;
        });

        $uniqueNotifications = $grouped->map(function ($group) {
            $first = $group->first();
            $first->recipient_count = $group->count();
            $first->status = 'sent';
            return $first;
        })->values();

        $currentPage = $request->get('page', 1);
        $offset = ($currentPage - 1) * $perPage;
        $paginatedItems = $uniqueNotifications->slice($offset, $perPage)->values();
        $total = $uniqueNotifications->count();
        $lastPage = (int) ceil($total / $perPage);

        return ApiResponse::success(
            [
                'notifications' => $paginatedItems->toArray(),
                'pagination' => [
                    'current_page' => (int) $currentPage,
                    'per_page' => (int) $perPage,
                    'total' => $total,
                    'last_page' => $lastPage,
                ]
            ],
            'Data riwayat notifikasi berhasil diambil'
        );
    }

    public function show($id): JsonResponse
    {
        $notification = Notification::with(['fromUser:id,full_name,email'])->find($id);

        if (!$notification) {
            return ApiResponse::notFound('Notifikasi tidak ditemukan');
        }

        $allRecipients = $this->getBatchRecipients($notification);

        $notification->status = 'sent';
        $notification->recipients = $allRecipients;
        $notification->recipient_count = $allRecipients->count();

        return ApiResponse::success(
            ['notification' => $notification],
            'Detail notifikasi berhasil diambil'
        );
    }

    private function getCustomers()
    {
        return Customer::whereHas('user')
            ->with('user:id,full_name,email')
            ->get();
    }

    private function calculateTrend($previous, $current): float
    {
        if ($previous > 0) {
            return round((($current - $previous) / $previous) * 100, 2);
        }

        return $current > 0 ? 100 : 0;
    }

    private function formatRecipientPreview(array $recipientEmails, int $totalCount): string
    {
        $preview = implode(', ', array_slice($recipientEmails, 0, 3));

        if ($totalCount > 3) {
            $preview .= ' dan ' . ($totalCount - 3) . ' lainnya';
        }

        return $preview;
    }

    private function applyFilters($query, Request $request): void
    {
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('body', 'like', "%{$search}%");
            });
        }

        if ($request->filled('from_user_id')) {
            $query->where('from_user_id', $request->from_user_id);
        }

        if ($request->filled('to_user_id')) {
            $query->where('to_user_id', $request->to_user_id);
        }

        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }
    }

    private function getBatchRecipients($notification)
    {
        return Notification::with(['toUser:id,full_name,email'])
            ->where('created_at', $notification->created_at)
            ->where('from_user_id', $notification->from_user_id)
            ->where('title', $notification->title)
            ->where('body', $notification->body)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->toUser->id,
                    'full_name' => $item->toUser->full_name,
                    'email' => $item->toUser->email
                ];
            });
    }
}
