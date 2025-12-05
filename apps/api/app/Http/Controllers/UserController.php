<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use App\Models\Address;
use App\Models\HistoryPoint;
use App\Models\Order;

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
			$result['user'] = $user->load('customer.addresses');
		} else if ($user['role'] = 'Staff') {
			$result['user'] = $user->load('staff.stores');
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

	public function createAddress(Request $request, string $username): JsonResponse
	{
		$rules = [
			'label' => 'required|string',
			'detail_address' => 'required|string',
			'notes_address' => 'nullable|string',
			'recipient_name' => 'nullable|string',
			'phone_number' => 'nullable|string',
			'latitude' => 'nullable',
			'longitude' => 'nullable',
			'is_default' => 'required|boolean',
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi tambah alamat gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil data inputan user, lalu cari user berikut customernya di dalam database dengan username dari parameter string query
		$data = $validator->validated();
		$user = User::where('username', $username)->first()->load('customer');

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan username $username tidak ditemukan. Gagal menambah alamat.");
		}

		// Jika user ditemukan, maka
		// Tambahkan alamat baru ke database sesuai inputan user
		$address = Address::create([
			'customer_id' => $user->customer['id'],
			'label' => $data['label'],
			'detail_address' => $data['detail_address'],
			'notes_address' => $data['notes_address'],
			'recipient_name' => $data['recipient_name'] ?? $user['first_name'] . ' ' . $user['last_name'],
			'phone_number' => $data['phone_number'] ?? $user['phone_number'],
			'latitude' => $data['latitude'],
			'longitude' => $data['longitude'],
			'is_default' => $data['is_default'],
		]);

		$result['address'] = $address;

		return $this->sendSuccessResponse("Berhasil menambah alamat.", $result);
	}

	public function changeAddress(Request $request, string $username, string $addressId): JsonResponse
	{
		// Tetapkan aturan (rules) validasi untuk mengganti alamat
		$rules = [
			'label' => 'nullable|string',
			'detail_address' => 'nullable|string',
			'notes_address' => 'nullable|string',
			'recipient_name' => 'nullable|string',
			'phone_number' => 'nullable|string',
			'latitude' => 'nullable',
			'longitude' => 'nullable',
			'is_default' => 'nullable|boolean',
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi ganti alamat gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		$data = $validator->validated();
		$address = Address::find($addressId);

		// Jika alamat tidak ditemukan pada database, maka
		if (!$address) {
			return $this->sendFailResponse("Alamat dengan id $addressId tidak ditemukan. Gagal mengganti alamat.");
		}

		// Jika alamat ditemukan, maka
		// Ganti value atribut milik entitas alamat tersebut dengan inputan dari user
		$address['label'] = $data['label'] ?? $address['label'];
		$address['detail_address'] = $data['detail_address'] ?? $address['detail_address'];
		$address['notes_address'] = $data['notes_address'] ?? $address['notes_address'];
		$address['recipient_name'] = $data['recipient_name'] ?? $address['recipient_name'];
		$address['phone_number'] = $data['phone_number'] ?? $address['phone_number'];
		$address['latitude'] = $data['latitude'] ?? $address['latitude'];
		$address['longitude'] = $data['longitude'] ?? $address['longitude'];
		$address['is_default'] = $data['is_default'] ?? $address['is_default'];

		// Simpan perubahan ke database
		$address->save();

		// Berikan data alamat yang telah diubah sebagai bukti bahwa alamat telah diubah
		$result['address'] = $address;

		return $this->sendSuccessResponse("Berhasil mengganti alamat.", $result);
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

	public function getPoint(string $username): JsonResponse
	{
		// Mencari user di database dengan username yang terdapat pada url
		$user = User::where('username', $username)->first()->load('customer');
		
		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan username $username tidak ditemukan. Gagal mendapatkan data point milik $username");
		}

		// Jika user ditemukan, maka
		// Ambil data terbaru dari riwayat point milik user, lalu ambil nilai dari kolom total_point saja
		$point = HistoryPoint::select('total_point')->where('customer_id', $user->customer['id'])->latest()->first();

		$result['total_point'] = $point;

		return $this->sendSuccessResponse("Berhasil mendapatkan data point user.", $result);
	}

	public function getOrderHistory(string $username): JsonResponse
	{
		// Mencari user di database dengan username yang terdapat pada url
		$user = User::where('username', $username)->first()->load('customer');
		
		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan username $username tidak ditemukan. Gagal mendapatkan data riwayat transaksi milik $username");
		}

		// Jika user ditemukan, maka
		$orders = Order::where('customer_id', $user->customer['id'])->latest()->get()->load('orderItems');

		$result['order'] = $orders;

		return $this->sendSuccessResponse("Berhasil mendapatkan data riwayat transaksi milik user.", $result);
	}
}
