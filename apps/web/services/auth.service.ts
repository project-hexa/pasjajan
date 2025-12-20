import {
  loginSchema,
  registerSchema,
  sendOTPSchema,
  verifyOTPSchema,
} from "@/lib/schema/auth.schema";
import { api } from "@/lib/utils/axios";
import { isAxiosError } from "axios";
import z from "zod";

export const authService = {
  login: async (
    payload: z.infer<typeof loginSchema>,
  ): Promise<LoginResponse> => {
    try {
      const { data } = await api.post<APIResponse<LoginResponse>>(
        "/auth/login",
        {
          user_identity: payload.email,
          ...payload,
        },
      );

      if (!data.success) {
        throw data;
      }

      return data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw {
          message: error.response?.data?.message ?? "Gagal Masuk!",
          errors: error.response?.data?.errors,
          status: error.response?.status,
        } satisfies APIError;
      }

      throw error;
    }
  },
  register: async (
    payload: z.infer<typeof registerSchema>,
  ): Promise<RegisterResponse> => {
    try {
      const { data } = await api.post<APIResponse<RegisterResponse>>(
        "/auth/register",
        payload,
      );

      if (!data.success) {
        throw data;
      }

      return data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw {
          message: error.response?.data?.message ?? "Gagal Masuk!",
          errors: error.response?.data?.errors,
          status: error.response?.status,
        } satisfies APIError;
      }

      throw error;
    }
  },
  sendOTP: async (payload: z.infer<typeof sendOTPSchema>) => {
    try {
      const { data } = await api.post("/auth/send-otp", payload);

      return {
        ok: true,
        message: data.message || "OTP Berhasil dikirim!",
      };
    } catch (error) {
      let message = "Logout Gagal!";

      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      return {
        ok: false,
        message,
      };
    }
  },
  verifyOTP: async (payload: z.infer<typeof verifyOTPSchema>) => {
    try {
      const { data } = await api.post("/auth/verify-otp", {
        otp: payload.pin,
        email: payload.email,
      });

      return {
        ok: true,
        message: data.message || "OTP Berhasil!",
      };
    } catch (error) {
      let message = "OTP Gagal!";

      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      return {
        ok: false,
        message,
      };
    }
  },
  logout: async (token: string) => {
    try {
      const { data } = await api.post<APIResponse<{ token: string }>>(
        "/auth/logout",
        { token },
      );

      if (!data.success) {
        throw data;
      }

      return data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw {
          message: error.response?.data?.message ?? "Gagal Masuk!",
          errors: error.response?.data?.errors,
          status: error.response?.status,
        } satisfies APIError;
      }

      throw error;
    }
  },
};
