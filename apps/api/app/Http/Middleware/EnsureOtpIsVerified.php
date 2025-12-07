<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;
use App\Models\Otp;

class EnsureOtpIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
		// Cari user dengan email yang terdapat pada inputan user
		$user = User::where('email', $request->input('email'))->first();
		$otp = null;

		// Jika tidak user ditemukan, maka
		if (!$user) {
			// Jika endpoint yg diakses adalah register, maka
			if ($request->is('api/auth/register')) {
				// Cari otp dengan email sesuai inputan user
				$otp = Otp::where('email', $request->input('email'))->first();
			} else {
				// Jika endpoint yg diakses adalah selain register, maka
				return response()->json([
					'message' => 'User tidak dapat ditemukan. Tidak dapat mengakses endpoint ini.',
				], 403);
			}
		} else {
			// Jika user ditemukan, maka
			// Ambil data otp yang tersambung dengan user
			$userOtp = $user->load('otps');
			$otp = $userOtp->otps()->latest()->first();
		}

		// Jika otp tidak ditemukan, maka
		if (!$otp) {
			return response()->json([
				'message' => 'Verifikasi OTP belum dilakukan. Tidak dapat mengakses endpoint ini.',
			], 403);
		} else {
			// Jika otp masih belum terverifikasi, maka
			if (!$otp['is_verified']) {
				return response()->json([
					'message' => 'OTP belum terverifikasi.',
				], 403);
			}
		}

		// Disini controller yg dipasangi middleware ini akan melakukan tugasnya
        return $next($request);
    }
}
