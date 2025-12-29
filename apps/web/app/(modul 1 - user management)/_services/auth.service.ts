import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendOTPSchema,
  verifyOTPSchema,
} from "@/app/(modul 1 - user management)/_schema/user.schema";
import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import z from "zod";

export const authService = {
  login: async (payload: Omit<z.infer<typeof loginSchema>, "rememberMe">) =>
    await handleApiResponse<LoginResponse>(
      async () =>
        await handleApiRequest.post<LoginResponse>(
          "/auth/login",
          {
            user_identity: payload.email,
            password: payload.password,
            role: payload.role,
          },
          {
            defaultErrorMessage: "Gagal Masuk!",
          },
        ),
    ),
  register: async (payload: z.infer<typeof registerSchema>) =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.post("/auth/register", payload, {
          defaultErrorMessage: "Gagal Daftar!",
        }),
    ),
  sendOTP: async (payload: z.infer<typeof sendOTPSchema>) =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.post<SendOTPResponse>(
          "/auth/send-otp",
          payload,
          {
            defaultErrorMessage: "Ada kesalahan saat mengirim OTP!",
          },
        ),
    ),
  verifyOTP: async (payload: z.infer<typeof verifyOTPSchema>) =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.post<VerifyOTPResponse>(
          "/auth/verify-otp",
          payload,
          {
            defaultErrorMessage: "OTP gagal diverifikasi!",
          },
        ),
    ),
  logout: async () =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.post("/auth/logout", {
          withAuth: true,
          defaultErrorMessage: "Logout Gagal!",
        }),
    ),
  resetPassword: async (payload: z.infer<typeof resetPasswordSchema>) =>
    await handleApiResponse(
      async () =>
        await handleApiRequest.post("/auth/forgot-password", payload, {
          defaultErrorMessage: "Gagal mengubah Password!",
        }),
    ),
};
