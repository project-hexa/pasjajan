import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/schema/auth.schema";
import { api } from "@/lib/utils/axios";
import { isAxiosError } from "axios";
import Cookies from "js-cookie";
import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthResponse {
  ok: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

type authStore = {
  user: User | null;
  token: string | null;
  registerHold: z.infer<typeof registerSchema> | null;
  setToken: (token: string | null) => void;
  login: (data: z.infer<typeof loginSchema>) => Promise<AuthResponse>;
  register: (data: z.infer<typeof registerSchema>) => Promise<AuthResponse>;
  setRegisterHold: (data: z.infer<typeof registerSchema>) => void;
  logout: () => Promise<AuthResponse>;
  sendOTP: (email: string) => Promise<AuthResponse>;
  verifyOTP: (pin: string) => Promise<AuthResponse>;
  forgotPassword: (email: string) => Promise<AuthResponse>;
  resetPassword: (
    data: z.infer<typeof resetPasswordSchema>,
  ) => Promise<AuthResponse>;
};

const cookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const useAuthStore = create<authStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      registerHold: null,
      setToken: (token) => set({ token }),
      login: async (data) => {
        const { email, password, rememberMe, role } = data;

        try {
          const response = await api.post("/auth/login", {
            user_identity: email,
            password,
            rememberMe,
            role,
          });

          const newToken = response.data.data.token;
          const userData = response.data.data.user_data;

          if (rememberMe) {
            Object.assign(cookiesOptions, { expires: 7 });
          }

          Cookies.set("token", newToken, cookiesOptions);
          Cookies.set("userRole", userData.role, cookiesOptions);

          set({ user: userData, token: newToken });

          return {
            ok: true,
            message: response.data.message || "Berhasil Masuk!",
            data: {
              token: newToken,
              user: userData,
            },
          };
        } catch (error) {
          let message = "Gagal Login!";

          if (isAxiosError(error)) {
            message = error.response?.data?.message ?? message;
          }

          return {
            ok: false,
            message,
          };
        }
      },
      register: async (data) => {
        const {
          address,
          email,
          full_name,
          password,
          password_confirmation,
          phone_number,
        } = data;

        try {
          const response = await api.post("/auth/register", {
            address,
            email,
            full_name,
            password,
            password_confirmation,
            phone_number,
          });

          const newToken = response.data.token;
          const userData = response.data.data.user_data;

          Cookies.set("token", newToken, cookiesOptions);

          set({ user: userData, token: newToken });

          return {
            ok: true,
            message: response.data.message || "Berhasil Mendaftar!",
            data: {
              token: newToken,
              user: userData,
            },
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
      setRegisterHold: (data) => {
        Cookies.set("verificationStep", "email-sent", cookiesOptions);
        set({ registerHold: data });
      },
      logout: async () => {
        try {
          Cookies.remove("token", { path: "/" });
          Cookies.remove("userRole", { path: "/" });

          set({ user: null, token: null });

          return { ok: true, message: "Logout Berhasil!" };
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
      sendOTP: async (email) => {
        try {
          const response = await api.post("/auth/send-otp", {
            email,
          });

          Cookies.set("verificationStep", "otp-sent", cookiesOptions);

          return {
            ok: true,
            message: response.data.message || "Kode OTP Berhasil Dikirim!",
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
      verifyOTP: async (pin) => {
        try {
          const response = await api.post("/auth/verify-otp", {
            otp: pin,
          });

          Cookies.remove("verificationStep", cookiesOptions);

          return {
            ok: true,
            message: response.data.message || "Verifikasi OTP Berhasil!",
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
      forgotPassword: async () => {
        // TODO: Implementation of forgotPassword
        return { ok: false, message: "Not implemented" };
      },
      resetPassword: async () => {
        // TODO: Implementation of resetPassword
        return { ok: false, message: "Not implemented" };
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);
