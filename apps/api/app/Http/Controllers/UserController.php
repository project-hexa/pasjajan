<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Hash;
use App\Models\User;
use App\Models\Customer;
use App\Models\Staff;
use App\Models\Address;
use App\Models\HistoryPoint;
use App\Models\Order;

class UserController extends BaseController
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $role): JsonResponse
    {
		// Ambil data seluruh user dengan difilter berdasarkan rolenya
		$users = User::where('role', Str::ucfirst($role))->get();

		$result['users'] = $users;

		return $this->sendSuccessResponse('Berhasil mendapatkan data seluruh user.', $result);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
		// Cek apakah inputan no HP sudah menggunakan format +62, jika belum maka tambahkan +62 didepannya
		$request->merge([
			'phone_number' => !Str::startsWith($request->input('phone_number'), '+62') ? Str::start($request->input('phone_number'), '+62') : $request->input('phone_number'),
		]);

		$rules = [
			'full_name' => 'required|string',
			'email' => 'required|unique:App\Models\User,email|string|email',
			'phone_number' => 'required|unique:App\Models\User,phone_number|numeric',
			'password' => [
				'required',
				'string',
				Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
				'confirmed',
			],
			'password_confirmation' => 'required',
			'role' => 'required|alpha:ascii',
			'status_account' => 'required|alpha:ascii',
		];

		if ($request->input('role') == 'Staff') {
			$rules['store_id'] = 'required|integer';
		}

		$data = $this->execValidation($request->all(), $rules);

		if (isset($data['errors'])) {
			return $this->sendFailResponse('Validasi tambah user gagal.', $data['errors'], 422);
		}

		if ($data['result']['role'] == 'Customer') {
			return $this->sendFailResponse('Tidak dapat menambah Customer baru.');
		}

		$user = $this->createUser($data['result']);

		$result['user_data'] = $user;

		return $this->sendSuccessResponse('Berhasil menambah user baru.', $data['result']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
		// Ambil data seluruh user dengan difilter berdasarkan rolenya
		$user = User::find($id);

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User tidak ditemukan. Gagal mendapatkan data user.");
		}

		switch ($user['role']) {
			// Jika role user yang dicari adalah customer atau staff, maka
			case 'Customer':
			case 'Staff':
				// Ambil juga data dari entitas customer atau staff
				$user = $user->load($user['role']);
				break;
			// Jika role user yang dicari itu selain customer atau staff, maka
			default:
				break;
		}

		$result['user_data'] = $user;

		return $this->sendSuccessResponse('Berhasil mendapatkan data user.', $result);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
		$rules = [
			'full_name' => 'nullable|string',
			'email' => 'nullable|unique:App\Models\User,email|string|email',
			'phone_number' => 'nullable|unique:App\Models\User,phone_number|numeric',
			'password' => [
				'nullable',
				'string',
				Password::min(8)->letters()->mixedCase()->numbers()->symbols(),
				'confirmed',
			],
			'password_confirmation' => 'nullable',
			'status_account' => 'nullable|alpha:ascii',
		];

		if ($request->input('role') == 'Staff') {
			$rules['store_id'] = 'nullable|integer';
		}

		$data = $this->execValidation($request->all(), $rules);

		// Jika validasi gagal (terdapat error validasi), maka
		if (isset($data['errors'])) {
			return $this->sendFailResponse('Validasi edit data user gagal.', $data['errors'], 422);
		}

		// Cari user dengan id dari parameter
		$user = User::find($id);

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User tidak ditemukan. Gagal mengubah data user.");
		}

		$user['full_name'] = $data['result']['full_name'] ?? $user['full_name'];
		$user['email'] = $data['result']['email'] ?? $user['email'];
		$user['phone_number'] = isset($data['result']['phone_number']) ? Str::start($data['result']['phone_number'], '+62') : $user['phone_number'];
		$user['password'] = $data['result']['password'] ?? $user['password'];
		$user['status_account'] = $data['result']['status_account'] ?? $user['status_account'];

		if ($request->input('role') == 'Staff') {
			$user['store_id'] = $data['result']['store_id'] ?? $user['store_id'];
		}

		$user->save();

		$result['user_data'] = $user;

		return $this->sendSuccessResponse('Berhasil mengubah data user.', $result);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
		// Cari user dengan id dari parameter
		$user = User::find($id);

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User tidak ditemukan. Gagal menghapus data user.");
		}

		// Jika user ditemukan, maka
		// Hapus user dengan mekanisme softdelete
		$user->delete();

		$result['user_data'] = $user;

		return $this->sendSuccessResponse('Berhasil menghapus data user.', $result);
    }

	public function getProfile(Request $request): JsonResponse
	{
		$rules = [
			'email' => 'required|exists:App\Models\User,email|string|email',
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi lihat profile gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil inputan user yang telah divalidasi
		$data = $validator->validated();

		// Mencari user di database dengan email yang terdapat pada url
		$user = User::where('email', $data['email'])->first();

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("Tidak menemukan user dengan email " . $data['email'] . ". Gagal mendapatkan data profile.");
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

	public function changeProfile(Request $request): JsonResponse
	{
		// Tetapkan aturan (rules) untuk validasi ganti profile
		$rules = [
			'full_name' => 'nullable|string',
			'phone_number' => 'nullable|unique:App\Models\User,phone_number|string|numeric',
			'address' => 'nullable|string',
			'email_before' => 'required|exists:App\Models\User,email|string|email',
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

		// Cari user dengan email yang sesuai dengan email dari database
		$user = User::where('email', $data['email_before'])->first();

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan email " . $data['email_before'] . " tidak ditemukan. Gagal mengganti profile.");
		}

		// Jika user ditemukan, maka
		// Ganti data user di database dengan data inputan user
		$user['full_name'] = $data['full_name'] ?? $user['full_name'];
		$user['phone_number'] = isset($data['phone_number']) ? Str::start($data['phone_number'], '+62') : $user['phone_number'];
		$user['email'] = $data['email'] ?? $user['email'];
		$user['birth_date'] = $data['birth_date'] ?? $user['birth_date'];
		$user['gender'] = $data['gender'] ?? $user['gender'];
		$user['avatar'] = $data['avatar'] ?? $user['avatar'];
		$user['status_account'] = $data['status_account'] ?? $user['status_account'];

		$user->save();

		// Lalu ambil data terbaru milik user di database
		$result['user'] = $user;

		return $this->sendSuccessResponse("Berhasil mengganti profile.", $result);
	}

	public function createAddress(Request $request): JsonResponse
	{
		$rules = [
			'email' => 'required|exists:App\Models\User,email|string|email',
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
		// Ambil data inputan user, lalu cari user berikut customernya di dalam database dengan email dari parameter string query
		$data = $validator->validated();
		$user = User::where('email', $data['email'])->first()->load('customer');

		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan email " . $data['email'] . " tidak ditemukan. Gagal menambah alamat.");
		}

		// Jika user ditemukan, maka
		// Tambahkan alamat baru ke database sesuai inputan user
		$address = Address::create([
			'customer_id' => $user->customer['id'],
			'label' => $data['label'],
			'detail_address' => $data['detail_address'],
			'notes_address' => $data['notes_address'] ?? null,
			'recipient_name' => $data['recipient_name'] ?? $user['full_name'],
			'phone_number' => $data['phone_number'] ?? $user['phone_number'],
			'latitude' => $data['latitude'] ?? null,
			'longitude' => $data['longitude'] ?? null,
			'is_default' => $data['is_default'],
		]);

		$result['address'] = $address;

		return $this->sendSuccessResponse("Berhasil menambah alamat.", $result);
	}

	public function changeAddress(Request $request, string $addressId): JsonResponse
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

	public function deleteAddress(string $addressId): JsonResponse
	{
		// Cari alamat dengan id dari parameter
		$address = Address::find($addressId);

		// Jika alamat tidak ditemukan, maka
		if (!$address) {
			return $this->sendFailResponse("Alamat tidak ditemukan. Gagal menghapus data alamat.");
		}

		// Jika alamat ditemukan, maka
		// Hapus alamat dengan mekanisme softdelete
		$address->delete();

		$result['address_data'] = $address;

		return $this->sendSuccessResponse('Berhasil menghapus data alamat.', $result);
	}

	public function changePassword(Request $request): JsonResponse
	{
		// Tetapkan aturan (rules) validasi untuk mengganti password
		$rules = [
			'email' => 'required|exists:App\Models\User,email|string|email',
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

	public function getPoint(Request $request): JsonResponse
	{
		$rules = [
			'email' => 'required|exists:App\Models\User,email|string|email',
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi lihat profile gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil inputan user yang telah divalidasi
		$data = $validator->validated();

		// Mencari user di database dengan email
		$user = User::where('email', $data['email'])->first()->load('customer');
		
		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan email " . $data['email'] . " tidak ditemukan. Gagal mendapatkan data point user.");
		}

		// Jika user ditemukan, maka
		// Ambil data point milik customer
		$point = $user->customer['point'];

		$result['total_point'] = $point;

		return $this->sendSuccessResponse("Berhasil mendapatkan data point user.", $result);
	}

	public function getOrderHistory(Request $request): JsonResponse
	{
		$rules = [
			'email' => 'required|exists:App\Models\User,email|string|email',
		];

		// Validasi inputan user berdasarkan aturan (rules) validasi ganti profile yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($request->all(), $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			return $this->sendFailResponse("Validasi lihat profile gagal.", $errors, 422);
		}

		// Jika validasi berhasil, maka
		// Ambil inputan user yang telah divalidasi
		$data = $validator->validated();

		// Mencari user di database dengan email
		$user = User::where('email', $data['email'])->first()->load('customer');
		
		// Jika user tidak ditemukan, maka
		if (!$user) {
			return $this->sendFailResponse("User dengan email " . $data['email'] . " tidak ditemukan. Gagal mendapatkan data riwayat transaksi user.");
		}

		// Jika user ditemukan, maka
		$orders = Order::where('customer_id', $user->customer['id'])->latest()->get()->load('orderItems');

		$result['order'] = $orders;

		return $this->sendSuccessResponse("Berhasil mendapatkan data riwayat transaksi milik user.", $result);
	}

	// Method private custom buatan sendiri khusus untuk UserController
	// Method untuk memasukkan data inputan admin ke database 
	private function createUser(array $data): User
	{
		// Memasukkan (insert) isi parameter array $data ke database
		$user = User::create([
			'full_name' => $data['full_name'],
			'email' => $data['email'],
			'phone_number' => $data['phone_number'],
			'password' => Hash::make($data['password']),
			'role' => $data['role'],
			'status_account' => $data['status_account'],
			'last_login_date' => now(),
		]);

		if ($user['role'] == 'Staff') {
			$staff = Staff::create([
				'user_id' => $user['id'],
				'store_id' => $data['store_id'],
			]);

			$user = $user->load('staff');
		}

		return $user;
	}
}
