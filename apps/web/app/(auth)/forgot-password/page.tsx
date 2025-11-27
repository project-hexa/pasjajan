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
import { Input } from "@workspace/ui/components/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function ForgotPasswordPage() {
  const forgotPassForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();

  const handleSubmit = (data: z.infer<typeof forgotPasswordSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex lg:w-1/2 md:w-2/3 max-lg:px-5 max-sm:-mt-40 flex-col overflow-hidden md:border-2 md:border-black max-sm:mx-5">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-0">
          {!forgotPassForm.formState.isSubmitSuccessful ? (
            <CardTitle className="text-2xl">Lupa Password?</CardTitle>
          ) : (
            <>
              <Image
                src="/icon-email-verif-code.svg"
                alt="Verification Code"
                width={250}
                height={250}
              />
              <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
            </>
          )}

          {!forgotPassForm.formState.isSubmitSuccessful ? (
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
                Kirim
              </Button>
              <Button variant="link">Coba cara lain</Button>
            </form>
          ) : (
            <>
              <p className="text-center text-xl">
                Anda telah memasukan{" "}
                <span className="font-bold">
                  {forgotPassForm.getValues("email")}
                </span>{" "}
                sebagai alamat email untuk akun anda silakan verifikasi alamat
                email ini dengan mengklik tombol di bawah.
              </p>
              <Button onClick={() => router.push("/reset-password")}>
                Verifkasi Email
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
