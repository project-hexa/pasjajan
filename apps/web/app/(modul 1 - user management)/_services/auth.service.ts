import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendOTPSchema,
  verifyOTPSchema,
} from "@/lib/schema/auth.schema";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import z from "zod";

export const authService = {
  login: async (payload: z.infer<typeof loginSchema>): Promise<LoginResponse> =>
    await handleApiRequest.post<LoginResponse>(
      "/auth/login",
      {
        user_identity: payload.email,
        ...payload,
      },
      {
        defaultErrorMessage: "Gagal Masuk!",
      },
    ),
  register: async (payload: z.infer<typeof registerSchema>) =>
    await handleApiRequest.post("/auth/register", payload, {
      defaultErrorMessage: "Gagal Daftar!",
    }),
  sendOTP: async (payload: z.infer<typeof sendOTPSchema>) =>
    await handleApiRequest.post<SendOTPResponse>("/auth/send-otp", payload, {
      defaultErrorMessage: "Ada kesalahan saat mengirim OTP!",
    }),
  verifyOTP: async (payload: z.infer<typeof verifyOTPSchema>) =>
    await handleApiRequest.post<VerifyOTPResponse>(
      "/auth/verify-otp",
      payload,
      {
        defaultErrorMessage: "OTP gagal diverifikasi!",
      },
    ),
  logout: async (token: string) =>
    await handleApiRequest.post(
      "/auth/logout",
      { token },
      {
        defaultErrorMessage: "Logout Gagal!",
      },
    ),
  resetPassword: async (payload: z.infer<typeof resetPasswordSchema>) =>
    await handleApiRequest.post("/auth/forgot-password", payload, {
      defaultErrorMessage: "Gagal mengubah Password!",
    }),
};
