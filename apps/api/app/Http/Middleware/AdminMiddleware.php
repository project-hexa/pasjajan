<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }
        $user = Auth::user();

        // Case-insensitive check untuk role Admin dan Staff
        if (!in_array(strtolower($user->role), ['admin', 'staff'])) {
            return response()->json([
                'message' => 'Forbidden. Only admin and staff can access this resource.'
            ], 403);
        }

        return $next($request);
    }
}
