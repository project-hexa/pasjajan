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
        $shipment = Shipment::with([
            'statusLogs' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }
        ])->where('order_id', $order_id)->first();

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
                'kurir' => $shipment->courier_name ?? 'Kurir PasJajan',
                'kurir_phone' => $shipment->courier_phone ?? null,
                'proof_image' => $shipment->proof_image ? asset('storage/' . $shipment->proof_image) : null,
                'timeline' => $shipment->statusLogs->map(function ($log) {
                    return [
                        'status' => $log->status_name,
                        'keterangan' => $log->note ?? 'Status diperbarui oleh sistem',
                        'tanggal' => $log->created_at->setTimezone('Asia/Jakarta')->format('d M Y'),
                        'jam' => $log->created_at->setTimezone('Asia/Jakarta')->format('H:i'),
                    ];
                })
            ]
        ]);
    }

    /**
     * Konfirmasi Pesanan Diterima (User)
     * Mengubah status dari DIKIRIM -> TERIMA_PESANAN
     */
    public function confirmDelivery(Request $request, $order_id)
    {
        $user = $request->user();

        // 1. Cari Shipment & Validasi Kepemilikan
        $shipment = Shipment::where('order_id', $order_id)
            ->whereHas('order.customer', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->first();

        if (!$shipment) {
            return response()->json(['message' => 'Pengiriman tidak ditemukan atau bukan milik Anda.'], 404);
        }

        // 2. Validasi Status Saat Ini
        $allowedStatusesToConfirm = ['DIKIRIM', 'DIKEMAS']; // Allow DIKEMAS for testing flexibility if needed
        if (!in_array($shipment->completion_status, $allowedStatusesToConfirm)) {
            return response()->json([
                'success' => false,
                'message' => 'Pesanan hanya bisa dikonfirmasi jika statusnya DIKIRIM.'
            ], 400);
        }

        // 3. Update Status
        $shipment->completion_status = 'TERIMA_PESANAN';
        $shipment->save();

        // 4. Catat Log
        \App\Models\ShipmentStatusLog::create([
            'shipment_id' => $shipment->id,
            'status_name' => 'TERIMA_PESANAN',
            'note' => 'Diterima dan dikonfirmasi oleh customer'
        ]);

        // 5. Update status Order utama
        if ($shipment->order) {
            $shipment->order->update(['status' => 'COMPLETED']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pesanan berhasil dikonfirmasi diterima.',
            'data' => [
                'status' => 'TERIMA_PESANAN',
                'can_review' => true
            ]
        ]);
    }

    // --- API 4: REVIEW (Untuk Form Bintang) ---
    // --- API 4: REVIEW (Untuk Form Bintang) ---
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

        // 3. Validasi Status Selesai (Indonesian Statuses)
        // TERIMA_PESANAN = Barang Sampai di User
        // PESANAN_SELESAI = User sudah klik Selesai / Auto Selesai
        $allowedStatuses = ['TERIMA_PESANAN', 'PESANAN_SELESAI'];

        if (!in_array($shipment->completion_status, $allowedStatuses)) {
            return response()->json([
                'success' => false,
                'message' => 'Anda hanya bisa memberi ulasan jika barang sudah diterima (Status: TERIMA_PESANAN).'
            ], 400);
        }

        // 4. Cek Duplicate Review
        if (ShipmentReview::where('shipment_id', $shipment->id)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memberikan ulasan untuk pengiriman ini.'
            ], 400);
        }

        // 5. Simpan Review
        ShipmentReview::create([
            'shipment_id' => $shipment->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'review_date' => now('Asia/Jakarta')
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Ulasan berhasil dikirim!'
        ], 201);
    }

    public function getReview($order_id)
    {
        $shipment = Shipment::with('review')->where('order_id', $order_id)->first();

        if (!$shipment) {
            return response()->json(['message' => 'Pengiriman tidak ditemukan'], 404);
        }

        if (!$shipment->review) {
            return response()->json([
                'success' => true,
                'data' => null,
                'message' => 'Belum ada ulasan.'
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'rating' => $shipment->review->rating,
                'comment' => $shipment->review->comment,
                'date' => $shipment->review->review_date,
            ]
        ]);
    }

    // --- API 5: ESTIMASI WAKTU PENGIRIMAN (Dynamic) ---
    public function estimateDeliveryTime(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'branch_id' => 'required|exists:stores,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 2. Ambil Lokasi Toko
        $branch = \App\Models\Store::find($request->branch_id);
        if (!$branch->latitude || !$branch->longitude) {
            return response()->json([
                'success' => false,
                'message' => 'Lokasi cabang tidak valid (koordinat belum diset).'
            ], 400);
        }

        // 3. Hitung Jarak (Haversine Formula) - Return KM
        $distance = $this->calculateDistance(
            $branch->latitude,
            $branch->longitude,
            $request->latitude,
            $request->longitude
        );

        // 4. Hitung Estimasi Waktu
        // Asumsi: Kecepatan rata-rata kurir motor = 40 km/jam
        // Tambahan buffer waktu persiapan 10 menit
        $averageSpeed = 40; // km/h
        $travelTimeHours = $distance / $averageSpeed;
        $travelTimeMinutes = ceil($travelTimeHours * 60) + 10;

        return response()->json([
            'success' => true,
            'message' => 'Estimasi waktu berhasil dihitung.',
            'data' => [
                'origin' => $branch->name,
                'destination_lat' => (float) $request->latitude,
                'destination_long' => (float) $request->longitude,
                'distance_km' => round($distance, 2),
                'estimated_minutes' => $travelTimeMinutes,
                'estimated_desc' => $travelTimeMinutes . ' Menit (Termasuk persiapan)',
            ]
        ]);
    }

    /**
     * Hitung jarak dua titik koordinat (Haversine Formula)
     * Return dalam Kilometer
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $earthRadius = 6371; // Radius bumi dalam KM

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Update status shipment (Admin/Kurir Internal)
     * Bisa upload bukti pengiriman (proof_image)
     */
    public function updateStatus(Request $request, $order_id)
    {
        // 1. Validasi
        $validator = Validator::make($request->all(), [
            'status' => 'required|string|in:DIKEMAS,DIKIRIM,TERIMA_PESANAN,PESANAN_SELESAI,DIBATALKAN',
            'proof_image' => 'nullable|image|max:2048', // Max 2MB
            'note' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Logic force note if status is DIBATALKAN
        if ($request->status === 'DIBATALKAN' && empty($request->note)) {
            return response()->json([
                'success' => false,
                'message' => 'Alasan pembatalan (note) wajib diisi jika status DIBATALKAN.'
            ], 422);
        }

        $shipment = Shipment::where('order_id', $order_id)->first();
        if (!$shipment) {
            return response()->json(['message' => 'Pengiriman tidak ditemukan'], 404);
        }

        // 2. Handle Upload Foto
        if ($request->hasFile('proof_image')) {
            $path = $request->file('proof_image')->store('proof-of-delivery', 'public');
            $shipment->proof_image = $path;
        }

        // 3. Update Status
        $shipment->completion_status = $request->status;
        $shipment->save();

        // 4. Catat Log
        \App\Models\ShipmentStatusLog::create([
            'shipment_id' => $shipment->id,
            'status_name' => $request->status,
            'note' => $request->note ?? 'Update status by Admin'
        ]);

        // 5. Kirim Notifikasi ke User (In-App Only)
        $order = $shipment->order; // Asumsi Shipment belongsTo Order
        if ($order && $order->customer && $order->customer->user) {
            \App\Models\Notification::create([
                'title' => "Update Pesanan #{$order->code}",
                'body' => "Status pesanan Anda telah diperbarui menjadi: " . $request->status,
                'from_user_id' => $request->user()->id, // Admin ID
                'to_user_id' => $order->customer->user->id,
                'type' => 'delivery',
                'related_id' => $order->id,
                'data' => json_encode(['status' => $request->status])
            ]);
        }


        return response()->json([
            'success' => true,
            'message' => 'Status pengiriman berhasil diperbarui.',
            'data' => [
                'status' => $shipment->completion_status,
                'proof_image' => $shipment->proof_image ? asset('storage/' . $shipment->proof_image) : null
            ]
        ]);
    }

    /**
     * Assign Courier (Admin)
     */
    public function assignCourier(Request $request, $order_id)
    {
        $validator = Validator::make($request->all(), [
            'courier_name' => 'required|string|max:100',
            'courier_phone' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $shipment = Shipment::where('order_id', $order_id)->first();
        if (!$shipment) {
            return response()->json(['message' => 'Pengiriman tidak ditemukan'], 404);
        }

        $shipment->courier_name = $request->courier_name;
        $shipment->courier_phone = $request->courier_phone;

        $shipment->save();

        // Log aktivitas
        \App\Models\ShipmentStatusLog::create([
            'shipment_id' => $shipment->id,
            'status_name' => $shipment->completion_status,
            'note' => 'Update info kurir: ' . $request->courier_name
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kurir berhasil ditugaskan.',
            'data' => [
                'courier_name' => $shipment->courier_name,
                'courier_phone' => $shipment->courier_phone
            ]
        ]);
    }

    /**
     * Get All Deliveries for Admin Monitoring
     */
    public function getDeliveriesForAdmin(Request $request)
    {
        $perPage = $request->query('per_page', 20);
        $status = $request->query('status');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');
        $courierName = $request->query('courier_name'); // Filter by Courier

        $query = Shipment::with(['order.customer.user', 'order.store']) // Load Order info
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('completion_status', $status);
        }

        if ($courierName) {
            $query->where('courier_name', 'like', "%{$courierName}%");
        }

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        $shipments = $query->paginate($perPage);

        // Transform data for Admin UI
        $data = $shipments->map(function ($shipment) {
            return [
                'id' => $shipment->id,
                'tracking_no' => 'SHP-' . $shipment->id, // Virtual Tracking No
                'order_code' => $shipment->order->code ?? 'N/A',
                'customer_name' => $shipment->order->customer->user->full_name ?? 'Guest',
                'store_name' => $shipment->order->store->name ?? 'Unknown Store',
                'status' => $shipment->completion_status,
                'courier_name' => $shipment->courier_name ?? 'Belum Ditugaskan',
                'courier_phone' => $shipment->courier_phone ?? '-',
                'cost' => $shipment->cost ?? 0,
                'last_updated' => $shipment->updated_at->format('Y-m-d H:i'),
                'proof_image' => $shipment->proof_image ? asset('storage/' . $shipment->proof_image) : null,
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Data pengiriman berhasil diambil.',
            'data' => $data,
            'meta' => [
                'current_page' => $shipments->currentPage(),
                'last_page' => $shipments->lastPage(),
                'total' => $shipments->total(),
            ]
        ]);
    }


}
