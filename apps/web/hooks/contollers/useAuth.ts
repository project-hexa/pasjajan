"use client";

import { api } from "@/lib/utils/axios";
import { toast } from "@workspace/ui/components/sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import z from "zod";
import {
  loginSchema,
  otpSchema,
  registerSchema,
  verificationCodeSchema,
} from "@/lib/schema/auth.schema";

export const useAuth = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getToken = () => {
    return Cookies.get("token");
  };

  const token = getToken();
  const isLoggedIn = !!token;

  const register = async (
    data: z.infer<typeof registerSchema>,
    opts: {
      showToast?: boolean;
      customMessage?: { success?: string; error?: string };
    } = {},
  ) => {
    const {
      full_name,
      email,
      phone_number,
      address,
      password,
      password_confirmation,
    } = data;
    const { showToast = true, customMessage } = opts;

    try {
      const request = api.post("/auth/register", {
        full_name,
        email,
        phone_number,
        address,
        password,
        password_confirmation,
      });

      if (showToast) {
        toast.promise(request, {
          loading: "Membuat akun...",
          toasterId: "global",
          success: () => customMessage?.success ?? "Akun Berhasil dibuat!",
          error: (error) => {
            // Handle error message
            let errorMessage = customMessage?.error ?? "Gagal membuat Akun!";

            if (error.response?.data) {
              const { message, errors } = error.response.data;

              // Handle nested validation_errors structure
              const validationErrors = errors?.validation_errors || errors;

              if (validationErrors) {
                if (validationErrors.email) {
                  errorMessage = "Email sudah digunakan!";
                } else if (validationErrors.phone_number) {
                  errorMessage = "Nomor telepon sudah digunakan!";
                } else if (validationErrors.username) {
                  errorMessage = "Username sudah digunakan!";
                } else {
                  const firstError = Object.values(validationErrors)[0];
                  errorMessage = Array.isArray(firstError)
                    ? firstError[0]
                    : firstError;
                }
              } else if (message) {
                errorMessage = message;
              }
            }

            return errorMessage;
          },
        });
      }

      const response = await request;

      if (
        response.status >= 200 &&
        response.status < 300 &&
        (response.data?.ok ?? true)
      ) {
        Cookies.set("verificationStep", "email-sent", {
          path: "/",
          secure: process.env.NODE_ENV === "production",
        });

        router.replace("/verification-code");
        return { success: true };
      }
    } catch (error) {
      console.error(`Register Error: ${error}`);

      return { success: false, error: error };
    }
  };

  const verificationCode = async (
    data: z.infer<typeof verificationCodeSchema>,
    opts: {
      showToast?: boolean;
      customMessage?: { success?: string; error?: string };
    } = {},
  ) => {
    const { email } = data;
    const { showToast = true, customMessage } = opts;

    try {
      const request = api.post("/auth/send-otp", {
        email,
      });

      if (showToast) {
        toast.promise(request, {
          loading: "Mengirim OTP...",
          toasterId: "global",
          success: () => customMessage?.success ?? "OTP Berhasil Dikirim!",
          error: (error) => {
            let errorMessage = customMessage?.error ?? "Gagal Mengirim OTP!";

            if (error.response?.data) {
              const { message, errors } = error.response.data;

              // Handle nested validation_errors structure
              const validationErrors = errors?.validation_errors || errors;

              if (validationErrors?.email) {
                errorMessage = Array.isArray(validationErrors.email)
                  ? validationErrors.email[0]
                  : "Email tidak ditemukan!";
              } else if (message) {
                errorMessage = message;
              }
            }

            return errorMessage;
          },
        });
      }

      const response = await request;

      if (
        response.status >= 200 &&
        response.status < 300 &&
      (response.data?.ok ?? true)
    ) {
      Cookies.set("verificationStep", "otp-sent", {
        path: "/",
        secure: process.env.NODE_ENV === "production",
      });        router.replace("/one-time-password");
        return { success: true };
      }
    } catch (error) {
      console.error(`Verification Code Error: ${error}`);

      return { success: false, error: error };
    }
  };

  const oneTimePassword = async (
    data: z.infer<typeof otpSchema>,
    opts: {
      showToast?: boolean;
      customMessage?: { success?: string; error?: string };
    } = {},
  ) => {
    const { pin } = data;
    const { showToast = true, customMessage } = opts;

    try {
      const request = api.post("/auth/verify-otp", {
        otp: pin,
      });

      if (showToast) {
        toast.promise(request, {
          loading: "Memverifikasi OTP...",
          toasterId: "global",
          success: () => customMessage?.success ?? "Verifikasi OTP Berhasil!",
          error: (error) => {
            let errorMessage = customMessage?.error ?? "Gagal Verifikasi OTP!";

            if (error.response?.data) {
              const { message, errors } = error.response.data;

              // Handle nested validation_errors structure
              const validationErrors = errors?.validation_errors || errors;

              if (validationErrors?.otp) {
                const otpError = Array.isArray(validationErrors.otp)
                  ? validationErrors.otp[0]
                  : validationErrors.otp;
                errorMessage = otpError || "Kode OTP tidak valid!";
              } else if (message) {
                // Sesuaikan pesan dari backend
                if (
                  message.toLowerCase().includes("invalid") ||
                  message.toLowerCase().includes("salah")
                ) {
                  errorMessage = "Kode OTP salah!";
                } else if (
                  message.toLowerCase().includes("expired") ||
                  message.toLowerCase().includes("kadaluarsa")
                ) {
                  errorMessage = "Kode OTP sudah kadaluarsa!";
                } else {
                  errorMessage = message;
                }
              }
            }

            return errorMessage;
          },
        });
      }

      const response = await request;

      if (
        response.status >= 200 &&
        response.status < 300 &&
        (response.data?.ok ?? true)
      ) {
        Cookies.remove("verificationStep", { path: "/" });

        router.replace("/login");
        return { success: true };
      }
    } catch (error) {
      console.error(`One Time Password Error: ${error}`);

      return { success: false, error: error };
    }
  };

  const login = async (
    data: z.infer<typeof loginSchema>,
    opts: {
      showToast?: boolean;
      customMessage?: {
        success?: string;
        error?: string;
      };
    } = {},
  ) => {
    const { email, password, rememberMe } = data;
    const { showToast = true, customMessage } = opts;

    try {
      const request = api.post("/auth/login", {
        user_identity: email,
        password,
        rememberMe,
      });

      if (showToast) {
        toast.promise(request, {
          loading: "Loading...",
          toasterId: "global",
          success: () => customMessage?.success ?? "Berhasil Masuk!",
          error: (error) => {
            let errorMessage = customMessage?.error ?? "Gagal Masuk!";

            if (error.response?.data) {
              const { message, errors } = error.response.data;

              // Handle nested validation_errors structure
              const validationErrors = errors?.validation_errors || errors;

              if (validationErrors) {
                // Check for specific validation errors
                if (validationErrors.user_identity || validationErrors.email) {
                  errorMessage = "Email atau username tidak ditemukan!";
                } else if (validationErrors.password) {
                  errorMessage = "Password salah!";
                } else {
                  const firstError = Object.values(validationErrors)[0];
                  errorMessage = Array.isArray(firstError)
                    ? firstError[0]
                    : firstError;
                }
              } else if (message) {
                // Sesuaikan pesan error login dari message
                if (
                  message.toLowerCase().includes("credentials") ||
                  message.toLowerCase().includes("invalid")
                ) {
                  errorMessage = "Email atau password salah!";
                } else if (
                  message.toLowerCase().includes("not verified") ||
                  message.toLowerCase().includes("belum terverifikasi")
                ) {
                  errorMessage = "Akun belum terverifikasi!";
                } else {
                  errorMessage = message;
                }
              }
            }

            return errorMessage;
          },
        });
      }

      const response = await request;

      if (
        response.status >= 200 &&
        response.status < 300 &&
        (response.data?.ok ?? true)
      ) {
        const newToken = response.data.token;
        const userData = response.data.data.user_data;

        const cookiesOptions: Cookies.CookieAttributes = {
          path: "/",
          secure: process.env.NODE_ENV === "production",
        };

        if (rememberMe) {
          Object.assign(cookiesOptions, { expires: 7 });
        }

        Cookies.set("token", newToken, cookiesOptions);

        if(typeof window !== "undefined"){
          localStorage.setItem("user", JSON.stringify(userData));
        }

        const redirectTo = searchParams.get("redirect");
        if (redirectTo) {
          router.replace(redirectTo);
        } else {
          router.replace("/");
        }

        return { success: true };
      }
    } catch (error) {
      console.error(`Login Error: ${error}`);

      return { success: false, error: error };
    }
  };

  const logout = async (
    opts: {
      showToast?: boolean;
      customMessage?: { success?: string; error?: string };
    } = {},
  ) => {
    const { showToast = true, customMessage } = opts;

    try {
      // Call backend logout endpoint (opsional, jika ada)
      await api.get("/auth/logout");

      Cookies.remove("token", { path: "/" });

      if (showToast) {
        toast.success(customMessage?.success || "Berhasil keluar!", {
          toasterId: "global",
        });
      }

      router.push("/login");
      router.refresh();

      return { success: true };
    } catch (error: any) {
      console.error(`Logout Error:`, error);

      // Tetap hapus token meskipun backend error
      Cookies.remove("token", { path: "/" });

      if (showToast) {
        toast.success(customMessage?.success || "Berhasil keluar!", {
          toasterId: "global",
        });
      }

      router.push("/login");
      router.refresh();

      return { success: true };
    }
  };

  return {
    login,
    isLoggedIn,
    logout,
    register,
    verificationCode,
    oneTimePassword,
  };
};
