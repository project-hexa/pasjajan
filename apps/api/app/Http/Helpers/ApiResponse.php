<?php

namespace App\Http\Helpers;

use Illuminate\Http\JsonResponse;

/**
 * ApiResponse Helper Class
 * 
 * Standardized API response format untuk seluruh aplikasi
 * 
 * @example
 * return ApiResponse::success('Data berhasil diambil', ['users' => $users]);
 * return ApiResponse::error('Data tidak ditemukan', [], 404);
 */
class ApiResponse
{
  /**
   * Response sukses
   * 
   * @param string $message Pesan sukses
   * @param mixed $data Data yang akan dikembalikan (bisa array, object, atau Resource)
   * @param int $code HTTP status code (default: 200)
   * @return JsonResponse
   */
  public static function success(string $message, $data = [], int $code = 200): JsonResponse
  {
    return response()->json([
      'success' => true,
      'status' => $code,
      'message' => $message,
      'data' => $data,
    ], $code);
  }

  /**
   * Response error
   * 
   * @param string $message Pesan error
   * @param array $errors Detail error (opsional, biasanya dari validation)
   * @param int $code HTTP status code (default: 400)
   * @return JsonResponse
   */
  public static function error(string $message, array $errors = [], int $code = 400): JsonResponse
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

  /**
   * Response validation error (422)
   * 
   * @param array $errors Validation errors dari validator
   * @param string $message Custom message (opsional)
   * @return JsonResponse
   */
  public static function validationError(array $errors, string $message = 'Validasi input gagal'): JsonResponse
  {
    return self::error($message, $errors, 422);
  }

  /**
   * Response not found (404)
   * 
   * @param string $message Pesan not found
   * @return JsonResponse
   */
  public static function notFound(string $message = 'Data tidak ditemukan'): JsonResponse
  {
    return self::error($message, [], 404);
  }

  /**
   * Response unauthorized (401)
   * 
   * @param string $message Pesan unauthorized
   * @return JsonResponse
   */
  public static function unauthorized(string $message = 'Unauthorized'): JsonResponse
  {
    return self::error($message, [], 401);
  }

  /**
   * Response forbidden (403)
   * 
   * @param string $message Pesan forbidden
   * @return JsonResponse
   */
  public static function forbidden(string $message = 'Forbidden'): JsonResponse
  {
    return self::error($message, [], 403);
  }

  /**
   * Response server error (500)
   * 
   * @param string $message Pesan error
   * @param array $errors Detail error (opsional)
   * @return JsonResponse
   */
  public static function serverError(string $message = 'Terjadi kesalahan pada server', array $errors = []): JsonResponse
  {
    return self::error($message, $errors, 500);
  }

  /**
   * Response created (201)
   * 
   * @param string $message Pesan sukses
   * @param mixed $data Data yang dibuat
   * @return JsonResponse
   */
  public static function created(string $message, $data = []): JsonResponse
  {
    return self::success($message, $data, 201);
  }

  /**
   * Response no content (204)
   * 
   * Digunakan untuk delete atau update tanpa return data
   * 
   * @return JsonResponse
   */
  public static function noContent(): JsonResponse
  {
    return response()->json([], 204);
  }
}
