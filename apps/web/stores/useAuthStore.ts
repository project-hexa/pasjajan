import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "@/lib/schema/auth.schema";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import z from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthActionResult =
  | {
      ok: true;
      message: string;
    }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string[]>;
      status?: number;
    };

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (payload: z.infer<typeof loginSchema>) => Promise<AuthActionResult>;
  register: (
    payload: z.infer<typeof registerSchema>,
  ) => Promise<AuthActionResult>;
  logout: () => Promise<AuthActionResult>;
  sendOTP: (email: string) => Promise<AuthActionResult>;
  verifyOTP: (email: string, pin: string) => Promise<AuthActionResult>;
  forgotPassword: (email: string) => Promise<AuthActionResult>;
  resetPassword: (
    payload: z.infer<typeof resetPasswordSchema>,
  ) => Promise<AuthActionResult>;
}

const cookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      login: async (payload) => {
        try {
          const res = await authService.login(payload);
          const { token, user_data } = res;

          if (payload.rememberMe) {
            Object.assign(cookiesOptions, { expires: 7 });
          }

          Cookies.set("token", token, cookiesOptions);

          set({ user: user_data, token, isLoggedIn: true });

          return {
            ok: true,
            message: "Berhasil Masuk!",
          };
        } catch (err) {
          const error = err as APIError;

          return {
            ok: false,
            message: error?.message ?? "Gagal Masuk!",
            errors: error?.errors,
            status: error?.status,
          };
        }
      },
      register: async (payload) => {
        try {
          const res = await authService.register(payload);
          const { customer_data, token } = res;

          Cookies.set("verificationStep", "email-sent", cookiesOptions);
          set({ user: customer_data, token, isLoggedIn: true });

          return {
            ok: true,
            message: "Berhasil Daftar!",
          };
        } catch (err) {
          const error = err as APIError;

          return {
            ok: false,
            message: error.message,
            errors: error.errors,
            status: error.status,
          };
        }
      },
      logout: async () => {
        try {
          await authService.logout(get().token || "");

          Cookies.remove("token", cookiesOptions);

          set({ user: null, token: null, isLoggedIn: false });

          return {
            ok: true,
            message: "Berhasil Logout!",
          };
        } catch (err) {
          const error = err as APIError;

          return {
            ok: false,
            message: error.message,
            errors: error.errors,
            status: error.status,
          };
        }
      },
      sendOTP: async (email) => {
        const res = await authService.sendOTP({ email });
        const { message } = res;

        if (!res.ok)
          return {
            ok: false,
            message,
          };

        Cookies.set("verificationStep", "otp-sent", cookiesOptions);

        return {
          ok: true,
          message,
        };
      },
      verifyOTP: async (email, pin) => {
        const res = await authService.verifyOTP({
          email,
          pin,
        });
        const { message } = res;

        if (!res.ok)
          return {
            ok: false,
            message,
          };

        Cookies.remove("verificationStep", cookiesOptions);

        return {
          ok: true,
          message,
        };
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
