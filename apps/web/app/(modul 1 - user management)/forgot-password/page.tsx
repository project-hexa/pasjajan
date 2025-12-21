"use client";

import { forgotPasswordSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import { useNavigate } from "@/hooks/useNavigate";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function ForgotPasswordPage() {
  const forgotPassForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const navigate = useNavigate();

  const handleSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    sessionStorage.setItem("emailForResetPassword", data.email);

    navigate.push("/reset-password");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden max-lg:px-5 max-sm:mx-5 max-sm:-mt-40 md:w-2/3 md:border-2 md:border-black lg:w-1/2">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-0">
          <CardTitle className="text-2xl">Lupa Password?</CardTitle>

          <form
            id="forgotPass"
            onSubmit={forgotPassForm.handleSubmit(handleSubmit)}
            className="flex flex-col items-center justify-center gap-4"
          >
            <Controller
              control={forgotPassForm.control}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldDescription className="text-center text-xl">
                    Masukan Email Anda Untuk Melakukan Verifikasi Kode.
                  </FieldDescription>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    type="email"
                    id="email"
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

            <Button type="submit" form="forgotPass">
              {forgotPassForm.formState.isSubmitting ? (
                <Icon
                  icon={"lucide:loader-circle"}
                  width={24}
                  className="animate-spin"
                />
              ) : (
                "Kirim"
              )}
            </Button>
            <Button variant="link">Coba cara lain</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
