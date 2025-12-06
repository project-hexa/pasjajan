<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shipment;
use App\Models\ShipmentReview;
use Illuminate\Support\Facades\Validator;

class DeliveryController extends Controller
{
    // --- API 1: TRACKING (Untuk UI Timeline Hijau) ---
    public function getTracking($order_id)
    {
        // Ambil data shipment beserta logs-nya, diurutkan dari terbaru
        $shipment = Shipment::with(['statusLogs' => function ($query) {
            $query->orderBy('created_at', 'desc');
        }])->where('order_id', $order_id)->first();

        if (!$shipment) {
            return response()->json([
                'success' => false,
                'message' => 'Data pengiriman belum tersedia untuk pesanan ini.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'shipment_id' => $shipment->id,
                'status_utama' => $shipment->completion_status,
                'kurir' => 'Kurir PasJajan',
                'timeline' => $shipment->statusLogs->map(function ($log) {
                    return [
                        'status' => $log->status_name,
                        'keterangan' => 'Status diperbarui oleh sistem',
                        'tanggal' => $log->created_at->format('d M Y'),
                        'jam' => $log->created_at->format('H:i'),
                    ];
                })
            ]
        ]);
    }

    // --- API 2: REVIEW (Untuk Form Bintang) ---
    public function submitReview(Request $request, $order_id)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Cek Data
        $shipment = Shipment::where('order_id', $order_id)->first();
        if (!$shipment) {
            return response()->json(['message' => 'Pengiriman tidak ditemukan'], 404);
        }

        // 3. Simpan Review
        ShipmentReview::create([
            'shipment_id' => $shipment->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'review_date' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ulasan berhasil dikirim!'
        ], 201);
    }
}
