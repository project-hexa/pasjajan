import type {
    Order,
    OrdersResponse,
    OrderResponse,
    OrderStatus,
} from "@/types/order.types";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class OrderService {
    private async fetchWithAuth(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<Response> {
        const token =
            typeof window !== "undefined" ? Cookies.get("token") : null;

        const headers = {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        return response;
    }

    /**
     * Get orders list with optional filters
     */
    async getOrders(params?: {
        status?: OrderStatus;
        payment_status?: string;
        search?: string;
        page?: number;
        per_page?: number;
    }): Promise<OrdersResponse> {
        const queryParams = new URLSearchParams();

        if (params?.status) queryParams.append("status", params.status);
        if (params?.payment_status)
            queryParams.append("payment_status", params.payment_status);
        if (params?.search) queryParams.append("search", params.search);
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.per_page)
            queryParams.append("per_page", params.per_page.toString());

        const queryString = queryParams.toString();
        const endpoint = `/orders${queryString ? `?${queryString}` : ""}`;

        const response = await this.fetchWithAuth(endpoint);

        if (!response.ok) {
            throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        return data.data;
    }

    /**
     * Get single order by code
     */
    async getOrderByCode(code: string): Promise<Order> {
        const response = await this.fetchWithAuth(`/orders/${code}`);

        if (!response.ok) {
            throw new Error("Failed to fetch order details");
        }

        const data: OrderResponse = await response.json();
        return data.order;
    }

    /**
     * Cancel an order
     */
    async cancelOrder(code: string): Promise<void> {
        const response = await this.fetchWithAuth(`/orders/${code}/cancel`, {
            method: "POST",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to cancel order");
        }
    }

    /**
     * Get payment receipt
     */
    async getPaymentReceipt(code: string): Promise<any> {
        const response = await this.fetchWithAuth(`/orders/${code}/receipt`);

        if (!response.ok) {
            throw new Error("Failed to fetch payment receipt");
        }

        const data = await response.json();
        return data.data.receipt;
    }
}

export const orderService = new OrderService();
