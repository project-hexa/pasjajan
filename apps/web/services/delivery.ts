import {
  adminDeliveryListSchema,
  deliveryConfirmationSchema,
  shipmentTrackingSchema,
} from "@/lib/schema/delivery.schema";
import { api } from "@/lib/utils/axios";

// --- User Services ---

export const getDeliveryTracking = async (orderId: number | string) => {
  const response = await api.get(`/delivery/${orderId}/tracking`);

  const parsedData = shipmentTrackingSchema.safeParse(response.data.data);

  if (!parsedData.success) {
    console.error("Tracking Schema Error:", parsedData.error);
    throw new Error("Gagal validasi data tracking.");
  }

  return parsedData.data;
};

export const confirmDelivery = async (orderId: number | string) => {
  const response = await api.post(`/delivery/${orderId}/confirm`);

  const parsedData = deliveryConfirmationSchema.safeParse(response.data.data);

  if (!parsedData.success) {
    console.error("Confirmation Schema Error:", parsedData.error);
    throw new Error("Gagal validasi response konfirmasi.");
  }

  return parsedData.data;
};

// --- Admin Services ---

export const getAdminDeliveries = async (params?: {
  page?: number;
  status?: string;
  courier_name?: string;
  search?: string; // Added search param
}) => {
  const response = await api.get("/admin/deliveries", { params });

  const parsedData = adminDeliveryListSchema.safeParse(response.data.data);

  if (!parsedData.success) {
    console.error("Admin Delivery List Schema Error:", parsedData.error);
    throw new Error("Gagal validasi data admin delivery.");
  }

  return {
    data: parsedData.data,
    meta: response.data.meta,
  };
};

export const checkShippingCost = async (methodId: number) => {
  const response = await api.post("/delivery/check-cost", { method_id: methodId });
  
  // Note: Response structure might differ slightly, adjust schema if needed or use simple parse
  return response.data;
};

export const updateDeliveryStatus = async (orderId: number | string, status: string, note?: string, courierName?: string, courierPhone?: string, proofImage?: File) => {
  const formData = new FormData();
  formData.append("status", status);
  if (note) formData.append("note", note);
  if (courierName) formData.append("courier_name", courierName);
  if (courierPhone) formData.append("courier_phone", courierPhone);
  if (proofImage) formData.append("proof_image", proofImage);

  const response = await api.post(`/admin/delivery/${orderId}/update`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
