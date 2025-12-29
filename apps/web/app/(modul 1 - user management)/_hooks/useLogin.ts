"use client";

import { useNavigate } from "@/hooks/useNavigate";
import { usePathname } from "next/navigation";
import { useUserStore } from "../_stores/useUserStore";
import { useForm } from "react-hook-form";
import { loginSchema } from "@/app/(modul 1 - user management)/_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { authService } from "../_services/auth.service";
import { toast } from "@workspace/ui/components/sonner";
import z from "zod";
import Cookies from "js-cookie";
import { baseCookiesOptions } from "@/lib/utils/cookies-option";

export const useLogin = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const { setUser, setIsLoggedIn } = useUserStore();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "Customer",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (pathname === "/login/admin") {
      loginForm.setValue("role", "Admin");
    } else {
      loginForm.setValue("role", "Customer");
    }
  }, [pathname, loginForm]);

  const handleOnSubmit = useCallback(
    async (data: z.infer<typeof loginSchema>) => {
      console.log(data);

      const result = await authService.login({
        email: data.email,
        password: data.password,
        role: data.role,
      });

      if (result?.ok) {
        toast.success("Berhasil Masuk!", {
          toasterId: "global",
        });

        const cookiesOptions: Cookies.CookieAttributes = data.rememberMe
          ? { ...baseCookiesOptions, expires: 7 }
          : { ...baseCookiesOptions };

        Cookies.set("token", result.data?.token ?? "", cookiesOptions);
        Cookies.set("role", result.data?.user_data.role, cookiesOptions);

        setUser(result.data?.user_data);
        setIsLoggedIn(true);

        if (pathname === "/login/admin" && data.role === "Admin") {
          navigate.push("/dashboard");
        } else if (pathname === "/login" && data.role === "Customer") {
          navigate.push("/");
        }
      } else {
        toast.error(result.message || "Gagal Masuk!", {
          description: result.description,
          toasterId: "global",
        });

        if (result.errors) {
          if (result.errors.email_verified) {
            if (Cookies.get("verificationStep") === "otp-sent") {
              navigate.push("/one-time-password");
            } else {
              Cookies.set("verificationStep", "email-sent");
              Cookies.set("pendingEmail", loginForm.getValues("email"));
              navigate.push("/send-otp");
            }
          }
        }
      }
    },
    [loginForm, navigate, pathname, setIsLoggedIn, setUser],
  );

  return {
    loginForm,
    handleOnSubmit,
  };
};
