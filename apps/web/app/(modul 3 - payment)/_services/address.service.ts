import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";

interface UserAddress {
    id: number;
    label: string;
    recipient_name: string;
    phone_number: string;
    detail_address: string;
    is_default: boolean;
}

interface UserProfileResponse {
    user: {
        customer?: {
            addresses: UserAddress[];
        };
    };
}

export const addressService = {
    /**
     * Get user addresses from profile
     */
    getUserAddresses: async (email: string) =>
        await handleApiResponse<UserProfileResponse>(
            async () =>
                await handleApiRequest.get<UserProfileResponse>("/user/profile", {
                    params: { email },
                    withAuth: true,
                    defaultErrorMessage: "Gagal memuat alamat pengguna!",
                }),
        ),
};
