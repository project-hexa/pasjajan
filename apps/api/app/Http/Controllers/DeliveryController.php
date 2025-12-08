<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Shipment;
use App\Models\ShipmentReview;
use App\Models\ShipmentMethod;
use Illuminate\Support\Facades\Validator;

class DeliveryController extends Controller
{
    // --- API 1: LIST METODE PENGIRIMAN (Untuk Dropdown Checkout) ---
    public function getDeliveryMethods()
    {
        $methods = ShipmentMethod::all();

        $data = $methods->map(function ($method) {
            return [
                'id' => $method->id,
                'name' => $method->name,
                'description' => $method->description ?? null,
                'type' => 'delivery',
                'estimated_time' => '1 Hari (Same Day)',
                'base_price' => 5000
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'List metode pengiriman berhasil diambil.',
            'data' => $data
        ]);
    }

    // --- API 2: CEK ONGKIR (Untuk Hitung Biaya) ---
    public function checkShippingCost(Request $request)
    {
        // Validasi
        $validator = Validator::make($request->all(), [
            'method_id' => 'required|exists:shipment_methods,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $method = ShipmentMethod::find($request->method_id);

        // Logic Flat Rate (Kurir Mahasiswa = 5000)
        $flatRate = 5000;

        return response()->json([
            'success' => true,
            'message' => 'Cek ongkir berhasil.',
            'data' => [
                'method_name' => $method->name,
                'cost' => $flatRate,
                'currency' => 'IDR',
                'estimated_time' => '1 Hari (Same Day)',
                'note' => 'Tarif jauh-dekat sama (Flat Rate).'
            ]
        ]);
    }

    // --- API 3: TRACKING (Untuk UI Timeline Hijau) ---
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

    // --- API 4: REVIEW (Untuk Form Bintang) ---
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
