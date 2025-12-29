"use client";

import { useNavigate } from "@/hooks/useNavigate";
import { resetPasswordSchema } from "@/app/(modul 1 - user management)/_schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { authService } from "../_services/auth.service";
import { toast } from "@workspace/ui/components/sonner";

export const useResetPassword = () => {
  const navigate = useNavigate();

  const resetPassForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  useEffect(() => {
    const email = sessionStorage.getItem("emailForResetPassword");

    if (!email) {
      navigate.push("/forgot-password");
    } else {
      resetPassForm.setValue("email", email);
    }
  }, [resetPassForm, navigate]);

  const handleSubmit = useCallback(
    async (data: z.infer<typeof resetPasswordSchema>) => {
      const result = await authService.resetPassword(data);

      if (result.ok) {
        toast.success(result.message || "Berhasil merubah Password!", {
          toasterId: "global",
        });

        navigate.replace("/login");
      } else {
        toast.error(result.message || "Gagal merubah Password!", {
          toasterId: "global",
        });
      }
    },
    [navigate],
  );

  return {
    resetPassForm,
    handleSubmit,
  };
};
