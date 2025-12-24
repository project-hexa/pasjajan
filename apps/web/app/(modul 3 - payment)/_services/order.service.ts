import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import type { OrderResponse } from "@/types/order.types";

interface BranchesResponse {
    branches: Array<{
        id: number;
        name: string;
        address?: string;
    }>;
}

interface ProductsResponse {
    data: Array<{
        id: number;
        name: string;
        price: number;
        stock: number;
        image_url: string | null;
    }>;
}

export const orderService = {
    /**
     * Get order details by order code
     */
    getOrder: async (orderCode: string) =>
        await handleApiResponse<OrderResponse>(
            async () =>
                await handleApiRequest.get<OrderResponse>(`/orders/${orderCode}`, {
                    // Don't use withAuth: true because it uses getApiWithAuth() which relies on
                    // next/headers (server-side only). Since payment page is a client component,
                    // we use the default api instance which has interceptor that adds token from js-cookie.
                    defaultErrorMessage: "Gagal memuat data order!",
                }),
        ),

    /**
     * Get public branches list
     */
    getBranches: async () =>
        await handleApiResponse<BranchesResponse>(
            async () =>
                await handleApiRequest.get<BranchesResponse>("/branches/public", {
                    defaultErrorMessage: "Gagal memuat data cabang!",
                }),
        ),

    /**
     * Get all products
     */
    getProducts: async () =>
        await handleApiResponse<ProductsResponse>(
            async () =>
                await handleApiRequest.get<ProductsResponse>("/products", {
                    // Don't use withAuth here either - same reason as getOrder
                    defaultErrorMessage: "Gagal memuat data produk!",
                }),
        ),

    /**
     * Get payment receipt for an order
     */
    getPaymentReceipt: async (orderCode: string) =>
        await handleApiResponse<{ receipt: unknown }>(
            async () =>
                await handleApiRequest.get<{ receipt: unknown }>(`/orders/${orderCode}/receipt`, {
                    defaultErrorMessage: "Gagal mengunduh bukti transaksi!",
                }),
        ),
};
