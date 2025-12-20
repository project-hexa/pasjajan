import { createServerApi } from "@/lib/utils/axios";

export interface TrackingTimeline {
    status: string;
    keterangan: string;
    tanggal: string;
    jam: string;
}

export interface TrackingData {
    shipment_id: number;
    status_utama: string;
    kurir: string;
    timeline: TrackingTimeline[];
}

// Mock Data for Tracking
export const getTrackingServer = async (orderId: number): Promise<TrackingData | null> => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        shipment_id: orderId,
        status_utama: "DIKIRIM",
        kurir: "JNE Express",
        timeline: [
            {
                status: "DIKIRIM",
                keterangan: "Paket sedang dibawa kurir",
                tanggal: new Date().toLocaleDateString('id-ID'),
                jam: new Date().toLocaleTimeString('id-ID')
            },
            {
                status: "MENUNGGU_KURIR",
                keterangan: "Paket siap diambil oleh kurir",
                tanggal: new Date(Date.now() - 3600000).toLocaleDateString('id-ID'),
                jam: new Date(Date.now() - 3600000).toLocaleTimeString('id-ID')
            }
        ]
    };
    /*
    try {
        const api = await createServerApi();
        const { data } = await api.get(`/delivery/${orderId}/tracking`);

        if (data.success) {
            return data.data;
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch tracking data:", error);
        return null;
    }
    */
}
