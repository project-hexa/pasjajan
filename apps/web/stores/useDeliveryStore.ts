import { create } from "zustand";
import { getDeliveryTracking, confirmDelivery } from "@/services/delivery";

interface TrackingData {
  shipment_id: number;
  customer_user_id: number; // Added for Access Control
  status_utama: string;
  kurir: string;
  kurir_phone: string | null;
  proof_image: string | null;
  rating: number | null; // Added
  review_comment: string | null; // Added
  timeline: {
    status: string;
    keterangan: string;
    tanggal: string;
    jam: string;
  }[];
}

interface DeliveryStore {
  trackingData: TrackingData | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchTracking: (orderId: number | string) => Promise<void>;
  confirmOrder: (orderId: number | string) => Promise<void>;
  reset: () => void;
}

export const useDeliveryStore = create<DeliveryStore>((set) => ({
  trackingData: null,
  isLoading: false,
  error: null,

  fetchTracking: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getDeliveryTracking(orderId);
      // Ensure data matches TrackingData interface (Zod validation handled in service)
      set({ trackingData: data as TrackingData, isLoading: false });
    } catch (err: any) {
      const status = err.response?.status;
      let message = "Gagal memuat data pengiriman, silakan coba lagi nanti.";
      
      if (status === 404) {
        message = "Data pengiriman tidak ditemukan. Mohon periksa kembali pesanan Anda.";
      } else if (status === 403 || status === 401) {
        message = "Anda tidak memiliki akses untuk melihat pengiriman ini.";
      }

      set({ 
        error: message, 
        isLoading: false, 
        trackingData: null 
      });
    }
  },

  confirmOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await confirmDelivery(orderId);
      set((state) => ({
        isLoading: false,
        trackingData: state.trackingData ? {
          ...state.trackingData,
          status_utama: result.status // Update status to TERIMA_PESANAN locally
        } : null
      }));
    } catch (err: any) {
      set({ isLoading: false, error: err.message || "Gagal konfirmasi pesanan." });
      throw err; // Re-throw needed for UI toast handling
    }
  },

  reset: () => set({ trackingData: null, error: null, isLoading: false }),
}));
