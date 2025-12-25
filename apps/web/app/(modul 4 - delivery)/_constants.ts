export const statusNotifications: Record<string, string> = {
    PESANAN_DIBUAT: "Pesanan Sedang Dikemas",
    DIKEMAS: "Pesanan Sedang Dikemas oleh Penjual",
    DIKIRIM: "Pesanan Anda Sedang Dikirim Oleh Kurir",
    SAMPAI_TUJUAN: "Paket Telah Sampai di Tujuan",
    TERIMA_PESANAN: "Pesanan Telah Diterima",
    PESANAN_SELESAI: "Pesanan Selesai",
    GAGAL: "Pesanan Gagal Dikirim",
};

export const STEPS = [
    { icon: "/img/icon-proses-1.png", label: "Pesanan dibuat" }, // 0
    { icon: "/img/icon-proses-2.png", label: "Sedang dikirim" }, // 1
    { icon: "/img/icon-proses-3.png", label: "Tiba di tujuan" }, // 2
    { icon: "/img/icon-proses-4.png", label: "Pesanan Selesai" }, // 3
];

export const STATUS_MAP: Record<string, number> = {
    'PENDING': 0,
    'PESANAN_DIBUAT': 0,
    'DIKEMAS': 0,
    'DIKIRIM': 1,
    'SAMPAI_TUJUAN': 2,
    'TERIMA_PESANAN': 3,
    'COMPLETED': 3,
    'PESANAN_SELESAI': 3
};
