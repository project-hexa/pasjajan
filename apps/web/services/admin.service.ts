import { createServerApi } from "@/lib/utils/axios";
import { Order, PaginationMeta } from "@/types/order";

interface GetAdminOrdersParams {
    page?: number;
    search?: string;
    status?: string;
    per_page?: number;
}

interface AdminOrdersResponse {
    orders: any[]; // Raw API response
    pagination: PaginationMeta;
}

// Use Mock Data from order.service.ts for now as per user request
import { getOrdersServer } from "./order.service";

export const getAdminOrdersServer = async (params: GetAdminOrdersParams): Promise<{ data: Order[], meta: PaginationMeta }> => {
    // Override with Explicit Mock Data to avoid API calls/HTML errors
    const mockOrders: any[] = [
        {
            id: 101,
            user_id: 2,
            total_amount: 150000,
            payment_status: 'paid',
            delivery_status: 'DIKIRIM',
            payment_method: 'QRIS',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: {
                id: 2,
                full_name: 'Budi Santoso',
                email: 'budi@example.com'
            },
            items: []
        },
        {
            id: 102,
            user_id: 3,
            total_amount: 75000,
            payment_status: 'paid',
            delivery_status: 'MENUNGGU_KURIR',
            payment_method: 'OVO',
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
                id: 3,
                full_name: 'Siti Aminah',
                email: 'siti@example.com'
            },
            items: []
        },
        {
            id: 103,
            user_id: 4,
            total_amount: 250000,
            payment_status: 'paid',
            delivery_status: 'SAMPAI_TUJUAN',
            payment_method: 'BCA Virtual Account',
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString(),
            user: {
                id: 4,
                full_name: 'Rudi Hartono',
                email: 'rudi@example.com'
            },
            items: []
        }
    ];

    const mockMeta: PaginationMeta = {
        current_page: params.page || 1,
        per_page: 10,
        total: 15,
        last_page: 2
    };

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
        data: mockOrders,
        meta: mockMeta
    };
    /*
    const response = await getOrdersServer({
        page: params.page,
        search: params.search
    });

    return {
        data: response.data,
        meta: response.meta
    };
    */
};

function mapBackendStatusToDeliveryStatus(backendStatus: string): any {
    switch (backendStatus) {
        case 'pending': return 'MENCARI_DRIVER';
        case 'processing': return 'MENUNGGU_KURIR';
        case 'shipped': return 'DIKIRIM';
        case 'delivered': return 'SAMPAI_TUJUAN';
        case 'completed': return 'SAMPAI_TUJUAN';
        case 'cancelled': return 'Gagal Dikirim';
        default: return 'MENCARI_DRIVER';
    }
}
