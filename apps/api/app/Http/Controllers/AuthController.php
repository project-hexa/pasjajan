<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
//use Illuminate\Support\MessageBag;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Session;
use Hash;
use Google\Client as GoogleClient;
use App\Models\User;
use App\Models\Customer;
use App\Models\Otp;
use App\Models\Address;
use App\Traits\LogsActivity;
use App\Http\Resources\UserResource;

class AuthController extends BaseController
{
    use LogsActivity;
    public function loginGet(): JsonResponse
    {
        return response()->json(["ok" => false, "status" => 401]);
    }

    public function loginPost(Request $request): JsonResponse
    {
        $validator = $this->makeValidator($request->all(), [
            'user_identity' => 'required|string',
            'password' => 'required|string',
            "role" => 'required|in:Admin,Staff,Customer'
        ]);

        if ($validator->fails()) {
            return $this->sendFailResponse(
                'Validasi login gagal.',
                $validator->errors()->toArray(),
                422
            );
        }

        $data = $validator->validated();

        // Tentukan tipe identitas
        if (filter_var($data['user_identity'], FILTER_VALIDATE_EMAIL)) {
            $field = 'email';
        } elseif (preg_match('/^8\d+$/', $data['user_identity'])) {
            $field = 'phone_number';
            $data['user_identity'] = '+62' . $data['user_identity'];
        } else {
            return $this->sendFailResponse(
                'Identitas harus berupa email atau nomor HP yang valid.',
                code: 422
            );
        }

        $user = User::where($field, $data['user_identity'])->first();

        if (!$user) {
            return $this->sendFailResponse(
                'Email/No HP belum terdaftar!',
                code: 401,
                description: "Silahkan Daftar terlebih dahulu."
            );
        }

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return $this->sendFailResponse(
                'Email/No HP atau password salah!',
                code: 401,
                description: "Silahkan cek kembali credential anda."
            );
        }

        if(!$user->email_verified_at){
            return $this->sendFailResponse(
                "Email/No HP belum diverifikasi!",
                [
                    "email_verified" => false
                ],
                401,
                "Silahkan Verifikasi Email terlebih dahulu."
            );
        }

        // Validasi role HANYA jika yang login adalah Admin
        if($data['role'] === "Admin" && $user->role !== "Admin"){
            return $this->sendFailResponse(
                "Akses Ditolak!",
                code: 401,
                description: "Anda bukan admin!."
            );
        }

        // Validasi role HANYA jika yang login adalah Staff
        if($data['role'] === "Staff" && $user->role !== "Staff"){
            return $this->sendFailResponse(
                "Akses Ditolak!",
                code: 401,
                description: "Anda bukan staff!."
            );
        }

        $user->tokens()->delete();

        if (in_array($user->role, ['Customer', 'Staff'])) {
            $user->load($user->role);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $this->logActivity(
            'LOGIN',
            "User {$user->full_name} berhasil login",
            $user->id
        );

        return $this->sendSuccessResponse('Login berhasil.', [
            'token' => $token,
            'user_data' => new UserResource($user),
        ]);
    }


    public function registerPost(Request $request): JsonResponse
    {
        $request->merge([
            'phone_number' => Str::startsWith($request->phone_number, '+62')
                ? $request->phone_number
                : '+62' . $request->phone_number,
        ]);

        $validator = $this->makeValidator($request->all(), [
            'full_name' => 'required|string',
            'phone_number' => 'required|string|unique:users,phone_number',
            'address' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
            ],
        ]);

        if ($validator->fails()) {
            return $this->sendFailResponse(
                'Validasi register gagal.',
                $validator->errors()->toArray(),
                code: 422
            );
        }

        $customer = $this->createCustomer($validator->validated());

        return $this->sendSuccessResponse(
            'Registrasi berhasil.',
            ['email' => $customer->user->email]
        );
    }


    public function loginViaGoogle(Request $request): JsonResponse
    {
        $request->validate([
            'id_token' => 'required'
        ]);

        $client = new GoogleClient(['client_id' => config('services.google.client_id')]);
        $payload = $client->verifyIdToken($request->id_token);

        if (!$payload) {
            return $this->sendFailResponse('Google Token Invalid.', code: 401);
        }

        // Google user info
        $googleId = $payload['sub'];
        $email = $payload['email'];
        $name = $payload['name'] ?? '';

        $user = User::firstOrCreate(
            [
                'full_name' => $name,
                'email' => $email,
                'phone_number' => '',
                'google_id' => $googleId,
                'password' => bcrypt(Str::random(16)),
                'last_login_date' => now(),
            ]
        );

        $token = $user->createToken('auth_token')->plainTextToken;

        $result = [
            'token' => $token,
            'user_data' => new UserResource($user->load($user['role'])),
        ];

        return $this->sendSuccessResponse('User berhasil login via google.', $result);
    }

    public function logout(Request $request): JsonResponse
    {
        // Log activity
        $user = $request->user();
        $this->logActivity('LOGOUT', "User {$user->full_name} berhasil logout", $user->id);

        // Hapus personal_access_token milik user yang sedang login
        $request->user()->currentAccessToken()->delete();

        return $this->sendSuccessResponse("User berhasil logout.");
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        // Menetapkan aturan (rules) validasi lupa password
        $rules = [
            'email' => 'required|string|email|exists:users,email',
            'password' => [
                'required',
                'string',
                Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
                'confirmed',
            ],
        ];

        // Validasi inputan user berdasarkan aturan validasi lupa password yang telah ditetapkan sebelumnya
        $validator = $this->makeValidator($request->all(), $rules);

        // Jika validasi gagal, maka
        if ($validator->fails()) {
            $errors['validation_errors'] = $validator->errors()->toArray();

            return $this->sendFailResponse("Validasi lupa password gagal.", $errors, 422);
        }

        // Jika validasi berhasil, maka
        // Ambil data inputan user yang sudah divalidasi tersebut
        $credentials = $validator->validated();

        // Mencari user dengan email inputan user
        $user = User::where('email', $credentials['email'])->first();

        // Jika tidak ditemukan, maka
        if (!$user) {
            return $this->sendFailResponse("User dengan email tersebut tidak ditemukan. Gagal mengganti password.", code: 401);
        }

        // Jika ditemukan, maka
        // Ubah password milik user berdasarkan email dari user
        $user['password'] = Hash::make($credentials['password']);
        $user->save();

        // Hapus otp milik user terkait
        $userOtp = $user->load('otps');
        $otp = $userOtp->otps()->first();
        if ($otp) {
            $this->deleteVerifiedOtp($otp);
        }

        // Hapus token auth sebelumnya milik user terkait, jika ada (untuk jaga2)
        $user->tokens()->delete();

        return $this->sendSuccessResponse("Password berhasil diubah. Silahkan login ulang.");
    }

    public function sendOtp(Request $request): JsonResponse
    {
        $type = $request->has('email') ? 'email' : ($request->has('phone_number') ? 'phone_number' : null);
        $context = $request->input('context', 'register');

        if (!$type) {
            return $this->sendFailResponse(
                'Email atau nomor HP wajib diisi.',
                code: 422
            );
        }

        $validator = $this->makeValidator($request->all(), [
            $type => $type === 'email' ? 'required|email' : 'required|string',
            'context' => 'sometimes|in:register,forgot_password',
        ]);

        if ($validator->fails()) {
            return $this->sendFailResponse(
                'Validasi OTP gagal.',
                $validator->errors(),
                422
            );
        }

        $data = $validator->validated();
        $user = User::where($type, $data[$type])->first();

        if ($context === 'register') {
            // Untuk registrasi: email/hp TIDAK BOLEH sudah terdaftar DAN terverifikasi
            if ($user && $user->email_verified_at !== null) {
                return $this->sendFailResponse(
                    'Email/No HP sudah terdaftar dan terverifikasi.',
                    code: 409
                );
            }

            if ($user && $user->email_verified_at === null) {
                $otp = Otp::where('user_id', $user->id)->first();
                $expire = $otp ? (($otp->attempt_count * 2) + 1) : 1;

                $otp = $otp
                    ? $this->updateOtp($expire, $user)
                    : $this->createOtp($expire, $user);
            } else {
                // User belum terdaftar sama sekali (registrasi pertama kali)
                $otp = Otp::where($type, $data[$type])->first();
                $expire = $otp ? (($otp->attempt_count * 2) + 1) : 1;

                $otp = $otp
                    ? $this->updateOtp($expire, null, $data[$type])
                    : $this->createOtp($expire, null, $data[$type]);
            }
        } else {
            // Untuk lupa password: email/hp HARUS sudah terdaftar
            if (!$user) {
                return $this->sendFailResponse(
                    'Email/No HP tidak terdaftar.',
                    code: 404
                );
            }

            if ($user->email_verified_at === null) {
                return $this->sendFailResponse(
                    'Email belum terverifikasi. Silakan verifikasi email terlebih dahulu.',
                    code: 403
                );
            }

            $otp = Otp::where('user_id', $user->id)->first();
            $expire = $otp ? (($otp->attempt_count * 2) + 1) : 1;

            $otp = $otp
                ? $this->updateOtp($expire, $user)
                : $this->createOtp($expire, $user);
        }

        $content = "Terima kasih telah mendaftar di PasJajan. Berikut adalah kode OTP anda: $otp->otp. Ini adalah kode rahasia Anda untuk PasJajan. Kode akan hangus dalam " . $expire . " menit. Demi keamanan, jangan berikan kode ini ke orang lain.";

        try {
            $email = $context === 'register' ? $data[$type] : $user->email;

            Mail::raw($content, function ($msg) use ($email) {
                $msg->to($email)->subject('Kode OTP');
            });
        } catch (\Throwable $e) {
            \Log::error('OTP email failed', ['error' => $e->getMessage()]);

            return $this->sendFailResponse(
                'Gagal mengirim OTP.',
                ['error' => $e->getMessage()],
                code: 500
            );
        }

        return $this->sendSuccessResponse(
            'OTP berhasil dikirim.',
            [
                'expired_at' => $otp->expires_at,
                'attempt_count' => $otp->attempt_count,
            ]
        );
    }


    public function verifyOtp(Request $request): JsonResponse
    {
        $validator = $this->makeValidator($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        if ($validator->fails()) {
            return $this->sendFailResponse(
                'Validasi verifikasi gagal.',
                $validator->errors()->toArray(),
                422
            );
        }

        $data = $validator->validated();

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return $this->sendFailResponse(
                'User tidak ditemukan.',
                code: 404
            );
        }

        $otp = Otp::where('user_id', $user->id)
            ->where('otp', $data['otp'])
            ->where('expires_at', '>=', now())
            ->first();

        if (!$otp) {
            return $this->sendFailResponse(
                'OTP salah atau kadaluarsa.',
                code: 401
            );
        }

        $user->update(['email_verified_at' => now()]);
        $otp->delete();

        return $this->sendSuccessResponse(
            'OTP terverifikasi.',
            [
                'token' => $user->createToken('auth_token')->plainTextToken,
                'user_data' => new UserResource($user),
            ]
        );
    }


    // Method private custom buatan sendiri khusus untuk AuthController
    // Method untuk memasukkan data inputan user ke database
    private function createCustomer(array $data): Customer
    {
        // Memasukkan (insert) isi parameter array $data ke database
        $user = User::create([
            'full_name' => $data['full_name'],
            'phone_number' => $data['phone_number'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'last_login_date' => now(),
        ]);

        // Memasukkan user baru ke tabel Customer
        $customer = Customer::create([
            'user_id' => $user['id'],
            'point' => 0,
        ]);

        // Memasukkan alamat milik user baru ke database
        $address = Address::create([
            'customer_id' => $customer['id'],
            'label' => 'Rumah',
            'detail_address' => $data['address'],
            'recipient_name' => $user['full_name'],
            'phone_number' => $user['phone_number'],
            'is_default' => true,
        ]);

        return $customer->load('user');
    }

    // Method untuk memasukkan data inputan otp dari user ke database
    private function createOtp(int $expiringTime, User $user = null, string $identifier = null): Otp
    {
        // Membuat otp, berikut bentuk hash & waktu kadaluarsanya
        $otp = rand(100000, 999999);
        //$hashedOtp = Hash::make($otp);
        $expiresAt = now()->addMinutes($expiringTime);

        if (!$user && $identifier) {
        // Untuk registrasi (user belum ada)
            return Otp::create([
                'email' => $identifier, // Bisa email atau phone_number
                'otp' => $otp,
                'expires_at' => $expiresAt,
                'attempt_count' => 1,
            ]);
        }

        // Untuk forgot password (user sudah ada)
        return Otp::create([
            'user_id' => $user->id,
            'otp' => $otp,
            'expires_at' => $expiresAt,
            'attempt_count' => 1,
        ]);
    }

    // Method untuk mengubah data otp milik user di database
    private function updateOtp(int $expiringTime, User $user = null, string $identifier = null): Otp
    {
        // Membuat kode otp, berikut bentuk hash & waktu kadaluarsanya
        $otp_code = rand(100000, 999999);
        //$hashedOtp = Hash::make($otp);
        $otp = null;

        // Jika data user tidak ditemukan, maka
        if (!$user && $identifier) {
            // Mencari otp milik user di database
            $otp = Otp::where('email', $email)->first();
        } else {
            // Jika data user ditemukan, maka
            // Mencari otp milik user di database
            $otp = Otp::where('user_id', $user['id'])->first();
        }

        // Mengubah (update) data otp (tanpa data user) di database
        $otp['otp'] = $otp_code;
        $otp['attempt_count'] += 1;
        $otp['expires_at'] = now()->addMinutes($expiringTime);

        $otp->save();

        return $otp;
    }
}
