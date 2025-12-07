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

class AuthController extends BaseController
{
	public function loginGet(): JsonResponse
	{
		return response()->json(["ok" => false, "status" => 401]);
	}

	public function loginPost(Request $request): JsonResponse
	{
		// Menetapkan aturan (rules) validasi login
		$rules = [
			'user_identity' => [
				'required',
				Rule::anyOf([
					['string', 'email'],
					['string', 'numeric'],
				]),
			],
			'password' => 'required|string',
		];

		// Validasi inputan user berdasarkan aturan validasi login yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi login gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil data credentials (inputan) milik user yang sudah divalidasi
		$credentials = $validator->validated();

		// Mengidentifikasi jenis inputan 'identitas user' yang dimasukkan user, apakah email atau nomor telp
		$userIdentityIs = '';
		if (Str::contains($credentials['user_identity'], '@')) {
			$userIdentityIs = 'email';
		} else if (Str::is('8*', $credentials['user_identity'])) {
			$userIdentityIs = 'phone_number';
			$credentials['user_identity'] = Str::start($credentials['user_identity'], '+62');
		}

		// Cari user yang sesuai dengan email/phone_number hasil inputan user
		$user = User::where($userIdentityIs, $credentials['user_identity'])->first();

		// Mengecek apakah inputan user sesuai atau tidak dengan data dari database
		if (!$user || !Hash::check($credentials['password'], $user['password'])) {
			// Jika tidak sesuai
			//return response()->json(["ok" => false, "status" => 400]);
			return $this->sendFailResponse("$userIdentityIs atau password anda salah. Login gagal.", code: 401);
		}

		// Jika sesuai
		// Hapus token auth sebelumnya milik user terkait, jika ada
		$user->tokens()->delete();

		// Muat entitas role terkait jika ada
		switch ($user['role']) {
			case 'Customer':
			case 'Staff':
				$user = $user->load($user['role']);
				break;
			default:
				break;
		}

		// Membuat token auth untuk user
		$result['token'] = $user->createToken('auth_token')->plainTextToken;
		$result['user_data'] = $user;

		//return response()->json(["ok" => true, "token" => $token, "status" => 200]);
		return $this->sendSuccessResponse("User berhasil login.", $result);
	}

	public function registerPost(Request $request): JsonResponse
	{
		// Cek apakah inputan no HP sudah menggunakan format +62, jika belum maka tambahkan +62 didepannya
		$request->merge([
			'phone_number' => !Str::startsWith($request->input('phone_number'), '+62') ? Str::start($request->input('phone_number'), '+62') : $request->input('phone_number'),
		]);

		// Menetapkan aturan (rules) validasi register
		$rules = [
			'full_name' => 'required|string',
			'phone_number' => 'required|string|string|unique:users,phone_number',
			'address' => 'required|string',
			'email' => 'required|string|email|unique:users,email',
			'password' => [
				'required',
				'string',
				Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
				'confirmed',
			],
			'password_confirmation' => 'required',
		];

		// Validasi inputan user berdasarkan aturan validasi register yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi register gagal.", $errors, 422);
		}

		// Jika validasi berhasil maka
		// Ambil seluruh data inputan milik user
		$data = $validator->validated();

		// Lalu masukkan data inputan user ke database
		$customer = $this->createCustomer($data);

		// Hapus otp milik user terkait
		$userOtp = $customer->load('user.otps');
		$this->deleteVerifiedOtp($userOtp);

		// Membuat token auth untuk user
		$result['token'] = $customer->user->createToken('auth_token')->plainTextToken;
		$result['customer_data'] = $customer;

		return $this->sendSuccessResponse("User berhasil register.", $result);
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
            'user_data'  => $user->load($user['role']),
		];

        return $this->sendSuccessResponse('User berhasil login via google.', $result);
	}

	public function logout(Request $request): JsonResponse
	{
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
			$errors['validation_errors'] = $validator->errors();

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
		$this->deleteVerifiedOtp($userOtp);

		// Hapus token auth sebelumnya milik user terkait, jika ada (untuk jaga2)
		$user->tokens()->delete();

		return $this->sendSuccessResponse("Password berhasil diubah. Silahkan login ulang.");
	}

	public function sendOtp(Request $request): JsonResponse
	{
		// Cari tahu apakah inputan user adalah nomor HP atau email
		$input_type = '';
		if ($request->has('phone_number')) {
			$input_type = 'phone_number';
		} else if ($request->has('email')) {
			$input_type = 'email';
		}

		// Menetapkan aturan (rules) validasi kirim otp
		$rules = [
			$input_type => 'required|' . ($input_type == 'email' ? $input_type : 'numeric'),
		];

		// Validasi inputan user berdasarkan aturan validasi kirim otp yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi kirim OTP gagal.", $errors, 422);
		}

		// Jika validasi berhasil maka
		// Ambil data inputan user yang sudah divalidasi
		$data = $validator->validated();

		// Mencari user dengan email yang sama dengan email inputan user, lalu membuatkan otp utk user tsb
		$user = User::where($input_type, $data[$input_type])->first();
		$otp = null;
		$emailAddress = null;

		// Jika tidak ditemukan, maka
		if (!$user) {
			$otp = $this->createOtp(email: $data[$input_type]);
			$emailAddress = $otp['email'];

			//return $this->sendFailResponse("User dengan $input_type $data[$input_type] tidak ditemukan. Gagal mengirim OTP.", code:401);
		} else {
			// Jika ditemukan, maka
			// Buat & masukkan otp baru milik user ke database
			$otp = $this->createOtp(user: $user);
			$emailAddress = $user['email'];
		}

		// Tetapkan isi konten pada badan email/chat/sms
		$content = "Terima kasih telah mendaftar di PasJajan. Berikut adalah kode OTP anda: $otp->otp. Ini adalah kode rahasia Anda untuk PasJajan. Kode akan hangus dalam 5 menit. Demi keamanan, jangan berikan kode ini ke orang lain.";

		if ($input_type == 'email') {
			// Mengirim otp ke alamat email milik user terkait
			Mail::raw($content, function ($message) use ($emailAddress) {
				$message->to($emailAddress)->subject('Your OTP Code');
			});
		} else if ($input_type == 'phone_number') {
			//
		}

		//$result['user_id'] = $user['id'];

		return $this->sendSuccessResponse("Berhasil mengirim OTP. Silahkan cek $input_type Anda.");
	}

	public function verifyOtp(Request $request): JsonResponse
	{
		// Menetapkan aturan (rules) validasi verifikasi otp
		$rules = [
			'email' => 'required|email',
			'otp' => 'required|digits:6',
		];

		// Validasi inputan user berdasarkan aturan validasi kirim otp yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi verifikasi gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil data inputan user yang sudah divalidasi
		$data = $validator->validated();

		// Mencari user dengan email yang sama dengan email inputan user
		$user = User::where('email', $data['email'])->first();
		$otp = null;

		// Jika user tidak ditemukan, maka
		if (!$user) {
			// Mencari apakah otp dengan email dari user itu sesuai atau tidak dengan otp inputan user, berikut mengecek apakah otp tsb sudah kadaluarsa atau belum
			$otp = Otp::where('email', $data['email'])
				->where('otp', $data['otp'])
				->where('expires_at', '>=', now())
				->first();
		} else {
			// Jika user ditemukan, maka
			// Mencari apakah otp milik user sesuai atau tidak dengan otp inputan user, berikut mengecek apakah otp tsb sudah kadaluarsa atau belum
			$otp = Otp::where('user_id', $user['id'])
				->where('otp', $data['otp'])
				->where('expires_at', '>=', now())
				->first();
		}

		// Jika otp tidak sesuai & kadaluarsa, maka
		if (!$otp) {
			return $this->sendFailResponse("OTP salah atau sudah expired. Verifikasi OTP gagal.", code: 401);
		}

		// Jika otp sesuai & tidak kadaluarsa, maka
		// Hapus otp milik user terkait
		//$otp->delete();
		// Update otp menjadi verified
		$otp['is_verified'] = true;
		$otp->save();

		$result['otp'] = $otp;

		return $this->sendSuccessResponse("Verifikasi OTP berhasil.", $result);
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
	private function createOtp(User $user = null, string $email = null): Otp
	{
		// Membuat otp, berikut bentuk hash & waktu kadaluarsanya
		$otp = rand(100000, 999999);
		//$hashedOtp = Hash::make($otp);
		$expiresAt = now()->addMinutes(5);

		// Jika data user tidak ditemukan, maka
		if (!$user) {
			// Memasukkan (insert) data otp (tanpa data user) ke database
			return Otp::create([
				'email' => $email,
				'otp' => $otp,
				'expires_at' => $expiresAt,
			]);
		}

		// Memasukkan (insert) data otp ke database
		return Otp::create([
			'user_id' => $user['id'],
			'otp' => $otp,
			'expires_at' => $expiresAt,
		]);

	}
}
