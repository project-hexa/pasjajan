<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LogController extends Controller
{
    /**
     * Get activity logs with search and filter
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user:id,first_name,last_name,email');        // Search by user email
        if ($request->has('email') && !empty($request->email)) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('email', 'like', '%' . $request->email . '%');
            });
        }

        // Search by user name
        if ($request->has('user') && !empty($request->user)) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('first_name', 'like', '%' . $request->user . '%')
                    ->orWhere('last_name', 'like', '%' . $request->user . '%');
            });
        }        // Search by activity type (aksi)
        if ($request->has('activity_type') && !empty($request->activity_type)) {
            $query->where('activity_type', 'like', '%' . $request->activity_type . '%');
        }

        // Search by description
        if ($request->has('description') && !empty($request->description)) {
            $query->where('description', 'like', '%' . $request->description . '%');
        }

        // Filter by date range
        if ($request->has('from') && !empty($request->from)) {
            $query->whereDate('timestamp', '>=', $request->from);
        }

        if ($request->has('to') && !empty($request->to)) {
            $query->whereDate('timestamp', '<=', $request->to);
        }

        // Order by timestamp descending (newest first)
        $query->orderBy('timestamp', 'desc');

        // Pagination
        $perPage = $request->get('per_page', 15);
        $logs = $query->paginate($perPage);

        return ApiResponse::success(
            [
                'logs' => $logs->items(),
                'pagination' => [
                    'current_page' => $logs->currentPage(),
                    'per_page' => $logs->perPage(),
                    'total' => $logs->total(),
                    'last_page' => $logs->lastPage(),
                ]
            ],
            'Data log aktivitas berhasil diambil'
        );
    }
}
