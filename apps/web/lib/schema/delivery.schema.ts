import { z } from "zod";

export const shipmentLogSchema = z.object({
  status: z.string(),
  keterangan: z.string(),
  tanggal: z.string(),
  jam: z.string(),
});

export const shipmentTrackingSchema = z.object({
  shipment_id: z.number(),
  customer_user_id: z.number().optional(), // Added
  status_utama: z.string(),
  kurir: z.string(),
  kurir_phone: z.string().nullable(),
  proof_image: z.string().nullable(),
  rating: z.number().nullable().optional(), // Added
  review_comment: z.string().nullable().optional(), // Added
  timeline: z.array(shipmentLogSchema),
});

export const deliveryConfirmationSchema = z.object({
  status: z.string(),
  can_review: z.boolean(),
});

export const adminDeliveryItemSchema = z.object({
  id: z.number(),
  order_id: z.number(), // Added
  tracking_no: z.string(),
  order_code: z.string(),
  customer_name: z.string(),
  store_name: z.string(),
  status: z.string(),
  courier_name: z.string(),
  courier_phone: z.string(),
  cost: z.number().or(z.string()), // Handle string decimal from API sometimes
  last_updated: z.string(),
  proof_image: z.string().nullable(),
  rating: z.number().nullable().optional(), // Added
  review_comment: z.string().nullable().optional(), // Added
});

export const shippingCostSchema = z.object({
  method_name: z.string(),
  cost: z.number(),
  currency: z.string(),
  estimated_time: z.string(),
  note: z.string(),
});

export const adminDeliveryListSchema = z.array(adminDeliveryItemSchema);
