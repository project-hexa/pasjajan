"use client";

import { api } from "@/lib/utils/axios";
import { useLocalStorage } from "@workspace/react-use";
import { toast } from "@workspace/ui/components/sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localToken, setLocalToken] = useLocalStorage<string | null>(
    "token",
    null,
  );

  const getToken = () => {
    return Cookies.get("token");
  };

  const token = getToken();
  const isLoggedIn = !!token;

  const login = async (
    data: {
      username: string;
      password: string;
      rememberMe: boolean;
    },
    opts: {
      showToast?: boolean;
      customMessage?: {
        success?: string;
        error?: string;
      };
    } = {},
  ) => {
    const { username, password, rememberMe } = data;
    const { showToast = true, customMessage } = opts;

    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });

      const newToken = response.data.token;

      if (rememberMe) {
        Cookies.set("token", newToken, {
          expires: 7,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      } else {
        Cookies.set("token", newToken, {
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      if (showToast) {
        toast.promise(new Promise<typeof data>((resolve) => resolve(data)), {
          loading: "Loading...",
          toasterId: "global",
          success: () => customMessage?.success ?? "Berhasil Masuk!",
          error: () => customMessage?.error ?? "Gagal Masuk!",
        });
      }

      const redirectTo = searchParams.get("redirect");
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push("/");
      }

      router.refresh();

      return { success: true };
    } catch (error) {
      console.error(`Login Error: ${error}`);
      return { success: false, token: error };
    }
  };

  const logout = (
    opts: {
      showToast?: boolean;
      customMessage?: { success?: string; error?: string };
    } = {},
  ) => {
    const { showToast, customMessage } = opts;

    Cookies.remove("token");

    if (showToast) {
      toast.success(customMessage?.success || "Berhasil keluar!");
    }

    router.push("/login");
    router.refresh();
  };

  return {
    login,
    isLoggedIn,
    logout,
  };
};
