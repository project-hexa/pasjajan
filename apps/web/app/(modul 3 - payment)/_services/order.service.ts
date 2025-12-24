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
                    withAuth: true,
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
                    withAuth: true,
                    defaultErrorMessage: "Gagal memuat data produk!",
                }),
        ),
};
