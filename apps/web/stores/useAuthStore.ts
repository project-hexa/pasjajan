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
  verifyOTP: (email: string, pin: string) => Promise<AuthResponse>;
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
        const res = await authService.login(data);
        const { token, user, message } = res;

        if (!res.ok)
          return {
            ok: false,
            message,
          };

        if (data.rememberMe) {
          Object.assign(cookiesOptions, { expires: 7 });
        }

        Cookies.set("token", token, cookiesOptions);
        if (data.role) {
          Cookies.set("userRole", data.role, cookiesOptions);
        }

        set({ user, token });

        return {
          ok: true,
          message,
          data: {
            token,
            user,
          },
        };
      },
      register: async (data) => {
        const res = await authService.register(data);
        const { message } = res;

        if (!res.ok)
          return {
            ok: false,
            message,
          };

        return {
          ok: true,
          message,
        };
      },
      setRegisterHold: (data) => {
        Cookies.set("verificationStep", "email-sent", cookiesOptions);
        sessionStorage.setItem("emailForOTP", data.email);
        set({ registerHold: data });
      },
      logout: async () => {
        Cookies.remove("token", { path: "/" });
        Cookies.remove("userRole", { path: "/" });

        set({ user: null, token: null });

        return { ok: true, message: "Logout Berhasil!" };
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
        registerHold: state.registerHold,
      }),
    },
  ),
);
