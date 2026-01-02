"use client";

import { sendOTPSchema } from "@/app/(modul 1 - user management)/_schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { toast } from "@workspace/ui/components/sonner";
import Image from "next/image";
import { useNavigate } from "@/hooks/useNavigate";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Cookies from "js-cookie";
import z from "zod";
import { authService } from "../_services/auth.service";

export default function VerificationCodePage() {
  const verifCodeForm = useForm<z.infer<typeof sendOTPSchema>>({
    resolver: zodResolver(sendOTPSchema),
    defaultValues: {
      email: "",
    },
  });
  const navigate = useNavigate();

  useEffect(() => {
    const email = Cookies.get("pendingEmail") || "";
    verifCodeForm.setValue("email", email);
  }, [verifCodeForm]);

  const handleSubmit = async (data: z.infer<typeof sendOTPSchema>) => {
    const result = await authService.sendOTP({
      email: data.email,
      context: "register",
    });

    if (result.ok) {
      toast.success(result.message || "OTP berhasil dikirim!", {
        toasterId: "global",
      });
      Cookies.set("verificationStep", "otp-sent");
      navigate.push("/one-time-password");
    } else {
      toast.error(result.message || "OTP gagal dikirim!", {
        toasterId: "global",
      });
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden max-lg:px-5 max-sm:mx-5 max-sm:-mt-40 md:w-2/3 md:border-2 md:border-black lg:w-1/2">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-0">
          <Image
            src="/img/icon-email-verif-code.svg"
            className="max-sm:size-32"
            alt="Verification Code"
            width={250}
            height={250}
          />

          <form
            id="verifCode"
            onSubmit={verifCodeForm.handleSubmit(handleSubmit)}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Controller
              control={verifCodeForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="sr-only">
                    Email Verification Code
                  </FieldLabel>
                  <FieldDescription className="text-center text-xl">
                    Masukan Email Anda Untuk Menerima Verifikasi Kode.
                  </FieldDescription>
                  <Input
                    type="email"
                    placeholder="Masukan Email"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" form="verifCode">
              {verifCodeForm.formState.isSubmitting ? (
                <Icon
                  icon={"lucide:loader-circle"}
                  width={32}
                  className="animate-spin"
                />
              ) : (
                "Kirim Kode Verifikasi"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
