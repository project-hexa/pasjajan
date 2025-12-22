import {
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  sendOTPSchema,
  verifyOTPSchema,
} from "@/lib/schema/auth.schema";
import { handleStore } from "@/lib/utils/handle-store";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import z from "zod";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  login: (payload: z.infer<typeof loginSchema>) => Promise<ActionResult>;
  register: (payload: z.infer<typeof registerSchema>) => Promise<ActionResult>;
  logout: (token: string) => Promise<ActionResult>;
  sendOTP: (payload: z.infer<typeof sendOTPSchema>) => Promise<ActionResult>;
  verifyOTP: (
    payload: z.infer<typeof verifyOTPSchema>,
  ) => Promise<ActionResult>;
  resetPassword: (
    payload: z.infer<typeof resetPasswordSchema>,
  ) => Promise<ActionResult>;
}

const cookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      login: async (payload) =>
        await handleStore(async () => {
          const res = await authService.login(payload);
          const { token, user_data } = res;

          if (payload.rememberMe) {
            Object.assign(cookiesOptions, { expires: 7 });
          }

          Cookies.set("token", token, cookiesOptions);
          Cookies.set("role", user_data.role, cookiesOptions);

          set({ user: user_data, isLoggedIn: true });
        }, "Berhasil Masuk!"),
      register: async (payload) =>
        await handleStore(async () => {
          await authService.register(payload);
          Cookies.set("verificationStep", "email-sent", cookiesOptions);
          Cookies.set("pendingEmail", payload.email, cookiesOptions);
        }, "Berhasil Daftar!"),
      logout: async (token) =>
        await handleStore(async () => {
          await authService.logout(token);

          Cookies.remove("token", cookiesOptions);
          Cookies.remove("role", cookiesOptions);

          set({ user: null, isLoggedIn: false });
        }, "Berhasil Logout"),
      sendOTP: async (payload) =>
        await handleStore(async () => {
          const { attempt_count, expired_at } =
            await authService.sendOTP(payload);
          Cookies.set("verificationStep", "otp-sent", cookiesOptions);
          Cookies.set(
            "OTP_attempt_count",
            String(attempt_count),
            cookiesOptions,
          );
          Cookies.set(
            "OTP_expires_at",
            new Date(expired_at).toISOString(),
            cookiesOptions,
          );
        }, "Kode OTP Berhasil Dikirim!"),
      verifyOTP: async (payload) =>
        await handleStore(async () => {
          const { token, user_data } = await authService.verifyOTP(payload);
          Cookies.remove("verificationStep", cookiesOptions);
          Cookies.remove("pendingEmail", cookiesOptions);
          Cookies.set("token", token, cookiesOptions);
          set({ user: user_data, isLoggedIn: true });
        }, "OTP diverifikasi!"),
      resetPassword: async (payload) =>
        await handleStore(async () => {
          await authService.resetPassword(payload);

          sessionStorage.removeItem("emailForResetPassword");
        }, "Password Berhasil diubah!"),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
