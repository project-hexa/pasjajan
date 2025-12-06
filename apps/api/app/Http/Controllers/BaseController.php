<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator as ValidatorFacade;
use Illuminate\Validation\Validator;

class BaseController extends Controller
{
	// Method untuk membuat Validator custom sendiri
	public function makeValidator(array $input, array $rules): Validator
	{
		$messages = [
			'required' => 'Isian :attribute wajib diisi.',
			'string' => 'Isian :attribute harus berupa string.',
			'email' => 'Isian :attribute harus berupa alamat email yang valid.',
			'numeric' => 'Isian :attribute harus berupa angka.',
			'alpha' => 'Isian :attribute hanya boleh berisi huruf.',
			'alpha_num' => 'Isian :attribute hanya boleh berisi huruf dan angka.',
			'alpha_dash' => 'Isian :attribute hanya boleh berisi huruf, angka, tanda hubung, dan garis bawah.',
			'ascii' => 'Isian :attribute hanya boleh berisi karakter alfanumerik dan simbol ASCII tunggal.',
			'confirmed' => 'Konfirmasi :attribute tidak cocok.',
			'unique' => 'Isian :attribute sudah digunakan.',
			'exists' => 'Isian :attribute yang dipilih tidak terdapat dalam database.',
			'digits' => 'Isian :attribute harus terdiri dari :digits digit.',
			'min' => 'Isian :attribute harus minimal :min karakter.',
			'password.letters' => 'Isian :attribute harus mengandung setidaknya satu huruf.',
			'password.mixed' => 'Isian :attribute harus mengandung setidaknya satu huruf besar dan satu huruf kecil.',
			'password.numbers' => 'Isian :attribute harus mengandung setidaknya satu angka.',
			'password.symbols' => 'Isian :attribute harus mengandung setidaknya satu simbol.',
			'password.uncompromised' => 'Isian :attribute ditemukan dalam kebocoran data. Silakan pilih :attribute lain.',
		];

		return ValidatorFacade::make($input, $rules, $messages);
	}

	public function execValidation($requestData, $rules): array
	{
		// Validasi inputan user berdasarkan aturan (rules) validasi yang telah ditetapkan sebelumnya
		$validator = $this->makeValidator($requestData, $rules);

		// Jika validasi gagal, maka
		if ($validator->fails()) {
			$errors['validation_errors'] = $validator->errors();

			$data['errors'] = $errors;
		}

		// Jika validasi berhasil, maka
		// Ambil inputan user yang telah divalidasi
		$data['result'] = $validator->validated();

		return $data;
	}

	public function sendSuccessResponse(string $message, array $result = [], $code=200): JsonResponse
	{
		$response = [
			'success' => true,
			'status' => $code,
			'message' => $message,
			'data' => $result,
		];

		return response()->json($response, $code);
	}

	public function sendFailResponse(string $message, array $errors = [], $code=400): JsonResponse
	{
		$response = [
			'success' => false,
			'status' => $code,
			'message' => $message,
		];

		if (!empty($errors)) {
			$response['errors'] = $errors;
		}

		return response()->json($response, $code);
	}
}
