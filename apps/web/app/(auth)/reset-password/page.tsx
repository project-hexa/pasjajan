"use client";

import { Password } from "@/components/auth/password";
import { resetPasswordSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@workspace/ui/components/sonner";
import z from "zod";

export default function ForgotPasswordPage() {
  const resetPassForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const router = useRouter();

  const handleSubmit = (data: z.infer<typeof resetPasswordSchema>) => {
    toast.promise(
      new Promise<typeof resetPasswordSchema>((resolve) =>
        resolve(resetPasswordSchema),
      ),
      {
        loading: "Loading...",
        toasterId: "global",
        success: () => "Password Berhasil Diganti!",
        error: () => "Gagal Mengganti Password!",
      },
    );
    router.push("/login");
    console.log(data);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex lg:w-1/2 md:w-2/3 max-lg:px-5 max-sm:-mt-40 flex-col overflow-hidden md:border-2 md:border-black max-sm:mx-5">
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
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Konfirmasi Password baru
                  </FieldLabel>
                  <Password
                    id="confirmPassword"
                    field={field}
                    fieldState={fieldState}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" form="resetPass">
              Simpan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
