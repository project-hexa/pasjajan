"use client";

import { useNavigate } from "@/hooks/useNavigate";
import { registerSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authService } from "../_services/auth.service";
import { toast } from "@workspace/ui/components/sonner";
import { baseCookiesOptions } from "@/lib/utils/cookies-option";

export const useRegister = () => {
  const navigate = useNavigate();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      password: "",
      password_confirmation: "",
    },
  });

  const phone = registerForm.watch("phone_number");

  useEffect(() => {
    if (phone.startsWith("+62")) {
      registerForm.setValue("phone_number", phone.slice(3));
    }

    if (phone.startsWith("0")) {
      registerForm.setValue("phone_number", phone.slice(1));
    }
  }, [phone, registerForm]);

  const handleOnSubmit = useCallback(
    async (data: z.infer<typeof registerSchema>) => {
      const phone_number = data.phone_number.startsWith("0")
        ? "+62" + data.phone_number.slice(1)
        : "+62" + data.phone_number;
      data.phone_number = phone_number;

      const result = await authService.register(data);

      if (result.ok) {
        toast.success(result.message || "Berhasil Daftar Akun!", {
          toasterId: "global",
        });

        Cookies.set("verificationStep", "email-sent", baseCookiesOptions);
        Cookies.set("pendingEmail", data.email, baseCookiesOptions);

        navigate.push("/send-otp");
      } else {
        toast.error(result.message || "Gagal Daftar Akun!", {
          description: result.description,
          toasterId: "global",
        });
      }
    },
    [navigate],
  );

  return { registerForm, handleOnSubmit };
};
