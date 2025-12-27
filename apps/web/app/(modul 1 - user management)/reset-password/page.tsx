"use client";

import { Password } from "@/app/(modul 1 - user management)/_components/password";
import { resetPasswordSchema } from "@/lib/schema/auth.schema";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { toast } from "@workspace/ui/components/sonner";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { resetPassword } = useAuthStore();

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
      router.push("/forgot-password");
    } else {
      resetPassForm.setValue("email", email);
    }
  }, [resetPassForm, router]);

  const handleSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    const result = await resetPassword(data);

    if (result.ok) {
      toast.success(result.message, {
        toasterId: "global",
      });

      router.replace("/login");
    } else {
      toast.error(result.message, {
        toasterId: "global",
      });
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden max-lg:px-5 max-sm:mx-5 max-sm:-mt-40 md:w-2/3 md:border-2 md:border-black lg:w-1/2">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-0">
          <Icon icon="uil:padlock" width={200} />
          <CardTitle className="text-2xl">Atur Password</CardTitle>

          <form
            id="resetPass"
            onSubmit={resetPassForm.handleSubmit(handleSubmit)}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Controller
              control={resetPassForm.control}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="password">Password baru</FieldLabel>
                  <Password
                    id="password"
                    field={field}
                    fieldState={fieldState}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={resetPassForm.control}
              name="password_confirmation"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="password_confirmation">
                    Konfirmasi Password baru
                  </FieldLabel>
                  <Password
                    id="password_confirmation"
                    field={field}
                    fieldState={fieldState}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              type="submit"
              form="resetPass"
              disabled={resetPassForm.formState.isSubmitting}
            >
              {resetPassForm.formState.isSubmitting ? (
                <Icon
                  icon="lucide:loader-circle"
                  width={24}
                  className="animate-spin"
                />
              ) : (
                "Simpan"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
