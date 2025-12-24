export const statusOptions = [
    { key: "MENUNGGU_KURIR", label: "Menunggu Kurir", color: "text-gray-600" },
    { key: "DIKEMAS", label: "Sedang Dikemas", color: "text-green-600" },
    { key: "DIKIRIM", label: "Sedang Dikirim", color: "text-blue-600" },
    { key: "SAMPAI_TUJUAN", label: "Sampai Tujuan (Upload Bukti)", color: "text-green-700" },
    { key: "PESANAN_SELESAI", label: "Selesai", color: "text-gray-600" },
    { key: "GAGAL", label: "Gagal Dikirim", color: "text-red-600" },
];

export const failureTemplates = [
    "Alamat Tidak Valid....",
    "Alamat tidak ditemukan....",
    "Penerima tidak bisa dihubungi...",
    "Pesanan dibatalkan...",
];

export const getStatusDisplay = (status: string) => {
    return statusOptions.find(s => s.key === status) || { label: status, color: "text-gray-600" };
};

export const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
        return "-";
    }
};

export const formatTime = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(/\./g, ':') + " WIB";
    } catch (e) {
        return "-";
    }
};

export const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `Rp ${num.toLocaleString("id-ID")}`;
};
