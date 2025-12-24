import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import type {
    ProcessPaymentPayload,
    ProcessPaymentResponse,
    CheckPaymentStatusResponse,
} from "@/types/payment.types";

export const paymentService = {
    /**
     * Process payment for an order
     */
    processPayment: async (payload: ProcessPaymentPayload) =>
        await handleApiResponse<ProcessPaymentResponse>(
            async () =>
                await handleApiRequest.post<ProcessPaymentResponse>(
                    "/payment/process",
                    payload,
                    {
                        withAuth: true,
                        defaultErrorMessage: "Gagal memproses pembayaran!",
                    },
                ),
        ),

    /**
     * Check payment status for an order
     */
    checkPaymentStatus: async (orderCode: string) =>
        await handleApiResponse<CheckPaymentStatusResponse>(
            async () =>
                await handleApiRequest.post<CheckPaymentStatusResponse>(
                    "/payment/check-status",
                    { order_code: orderCode },
                    {
                        withAuth: true,
                        defaultErrorMessage: "Gagal mengecek status pembayaran!",
                    },
                ),
        ),
};
