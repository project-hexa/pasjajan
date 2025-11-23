<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use App\Models\User;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

	public function getProfile(string $username): JsonResponse
	{
		// Mencari user di database dengan username yang terdapat pada url
		$user = User::where('username', $username)->first();

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("Tidak menemukan user dengan username $username. Gagal mendapatkan data profile.");
		}

		// Jika user ditemukan, maka
		// Ambil data user
		if ($user['role'] = 'Customer') {
			$result['user'] = $user->load('customers.addresses');
		} else if ($user['role'] = 'Staff') {
			$result['user'] = $user->load('staffs.stores');
		}

		return $this->sendSuccessResponse("Berhasil mendapatkan data profile user.", $result);
	}

	public function changeProfile(Request $request, string $username): JsonResponse
	{
		// Tetapkan aturan (rules) untuk validasi ganti profile
		$rules = [
			'username' => 'nullable|unique:App\Models\User,username|string|alpha_dash:ascii',
			'first_name' => 'nullable|string|alpha:ascii',
			'last_name' => 'nullable|string|alpha:ascii',
			'phone_number' => 'nullable|unique:App\Models\User,phone_number|string|numeric',
			'address' => 'nullable|string',
			'email' => 'nullable|unique:App\Models\User,email|string|email',
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi ganti profile gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil data inputan user
		$data = $validator->validated();

		// Cari user dengan username yang sesuai dengan username dari url
		$user = User::where('username', $username)->first();

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan username $username tidak ditemukan. Gagal mengganti profile.");
		}

		// Jika user ditemukan, maka
		// Ganti data user di database dengan data inputan user
		$user['first_name'] = $data['first_name'] ?? $user['first_name'];
		$user['last_name'] = $data['last_name'] ?? $user['last_name'];
		$user['phone_number'] = isset($data['phone_number']) ? Str::start($data['phone_number'], '+62') : $user['phone_number'];
		$user['email'] = $data['email'] ?? $user['email'];
		$user['username'] = $data['username'] ?: $user['username'];
		$user['birth_date'] = $data['birth_date'] ?? $user['birth_date'];
		$user['gender'] = $data['gender'] ?? $user['gender'];
		$user['avatar'] = $data['avatar'] ?? $user['avatar'];
		$user['status_account'] = $data['status_account'] ?? $user['status_account'];

		$user->save();

		// Lalu ambil data terbaru milik user di database
		$result['user'] = $user;

		return $this->sendSuccessResponse("Berhasil mengganti profile.", $result);
	}

	public function changePassword(Request $request, string $username): JsonResponse
	{
		// Tetapkan aturan (rules) validasi untuk mengganti password
		$rules = [
			'password' => [
				'required',
				'string',
				Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
				'confirmed',
			],
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi ganti password gagal.", $errors, 422);
		}

		// Jika validasi berhasil,maka

		return $this->sendSuccessResponse("Berhasil mengganti password.");
	}
}
