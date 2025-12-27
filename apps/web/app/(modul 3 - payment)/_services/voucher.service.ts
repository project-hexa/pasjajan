import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";

export interface CustomerVoucher {
    id: number;
    voucher: {
        id: number;
        code: string;
        name: string;
        description: string | null;
        discount_value: string;
        required_points: number;
        start_date: string;
        end_date: string;
        is_active: boolean;
    };
    redeemed_at: string;
    is_used: boolean;
    used_at: string | null;
}

interface CustomerVouchersResponse {
    data: CustomerVoucher[];
}

interface CustomerPointsResponse {
    points: number;
}

export const voucherService = {
    /**
     * Get customer's redeemed vouchers (available for use)
     */
    getCustomerVouchers: async () =>
        await handleApiResponse<CustomerVoucher[]>(
            async () =>
                await handleApiRequest.get<CustomerVoucher[]>("/customer/vouchers", {
                    defaultErrorMessage: "Gagal memuat voucher!",
                }),
        ),

    /**
     * Get customer's current points
     */
    getCustomerPoints: async () =>
        await handleApiResponse<CustomerPointsResponse>(
            async () =>
                await handleApiRequest.get<CustomerPointsResponse>("/customer/points", {
                    defaultErrorMessage: "Gagal memuat poin!",
                }),
        ),
};
