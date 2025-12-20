import { Order, PaginationMeta } from "@/types/order";

interface GetOrdersParams {
    page?: number;
    period?: string;
    search?: string;
}

interface GetOrdersResponse {
    data: Order[];
    meta: PaginationMeta;
}

// Mock Data in module scope (Simulated Database)
let mockOrders: Order[] = [
    {
        id: 1,
        invoice_number: "INV/20251212/001",
        created_at: "2025-12-12T12:00:51",
        user: { full_name: "Miftahul Huda" },
        payment_method: "Mandiri",
        total_amount: 50000,
        status: "paid",
        delivery_status: "MENUNGGU_KURIR", // Sedang Dikemas equivalent
    },
    {
        id: 2,
        invoice_number: "INV/20251212/002",
        created_at: "2025-12-12T12:10:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "QRIS",
        total_amount: 50000,
        status: "paid",
        delivery_status: "SAMPAI_TUJUAN", // Telah Diterima
    },
    {
        id: 3,
        invoice_number: "INV/20251212/003",
        created_at: "2025-12-12T12:15:30",
        user: { full_name: "Sugeng" },
        payment_method: "Gopay",
        total_amount: 40000,
        status: "paid",
        delivery_status: "MENUNGGU_KURIR",
    },
    {
        id: 4,
        invoice_number: "INV/20251212/004",
        created_at: "2025-12-12T12:20:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "Permata Bank",
        total_amount: 50000,
        status: "paid",
        delivery_status: "DIKIRIM", // Sedang Dikirim
    },
    {
        id: 5,
        invoice_number: "INV/20251212/005",
        created_at: "2025-12-12T12:25:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "BCA",
        total_amount: 50000,
        status: "paid",
        delivery_status: "MENUNGGU_KURIR",
    },
    {
        id: 6,
        invoice_number: "INV/20251212/006",
        created_at: "2025-12-12T12:30:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "QRIS",
        total_amount: 50000,
        status: "paid",
        delivery_status: "MENUNGGU_KURIR",
    },
    {
        id: 7,
        invoice_number: "INV/20251212/007",
        created_at: "2025-12-12T12:35:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "OVO",
        total_amount: 50000,
        status: "paid",
        delivery_status: "MENUNGGU_KURIR",
    },
    {
        id: 8,
        invoice_number: "INV/20251212/008",
        created_at: "2025-12-12T12:40:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "QRIS",
        total_amount: 50000,
        status: "paid",
        delivery_status: "DIKIRIM",
    },
    {
        id: 9,
        invoice_number: "INV/20251212/009",
        created_at: "2025-12-12T12:45:00",
        user: { full_name: "Miftahul Huda" },
        payment_method: "QRIS",
        total_amount: 50000,
        status: "paid",
        delivery_status: "MENUNGGU_KURIR",
    },
];

export const getOrdersServer = async (
    params: GetOrdersParams
): Promise<GetOrdersResponse> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
        data: mockOrders,
        meta: {
            current_page: params.page || 1,
            last_page: 5,
            per_page: 10,
            total: 50,
        },
    };
};

export const updateOrderStatusServer = async (id: number, status: string, note?: string) => {
    const start = Date.now();
    while (Date.now() - start < 200) { } // Small delay to simulate work

    const order = mockOrders.find(o => o.id === id);
    if (order) {
        order.delivery_status = status as any;
        if (note) order.failure_note = note;
    }
    return order;
};

export const getUserOrdersReal = async (): Promise<Order[]> => {
    // Override with Mock Data to avoid API calls/HTML errors
    // Return the same mockOrders we use for the admin side
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockOrders;

    /*
    try {
        const { createServerApi } = await import("@/lib/utils/axios");
        const api = await createServerApi();
        const { data } = await api.get('/orders', {
            params: { per_page: 100 } // Fetch enough to likely find the item
        });

        if (data && data.data && data.data.orders) {
            return data.data.orders;
        }
        return [];
    } catch (error) {
        console.error("Failed to list real orders:", error);
        return [];
    }
    */
};
