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
  login: async (payload: z.infer<typeof loginSchema>) => {
    try {
      const { data } = await api.post("/auth/login", {
        user_identity: payload.email,
        ...payload,
      });

      return {
        ok: true,
        token: data.data.token,
        user: data.data.user_data,
        message: data.message || "Berhasil Masuk!",
      };
    } catch (error) {
      let message = "Gagal Masuk!";

      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      return {
        ok: false,
        message,
      };
    }
  },
  register: async (payload: z.infer<typeof registerSchema>) => {
    try {
      const { data } = await api.post("/auth/register", payload);

      return {
        ok: true,
        message: data.message || "Berhasil Daftar Akun!",
      };
    } catch (error) {
      let message = "Gagal Mendaftar!";

      if (isAxiosError(error)) {
        message = error.response?.data?.message ?? message;
      }

      return {
        ok: false,
        message,
      };
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
};
