"use client";

import { verificationCodeSchema } from "@/lib/schema/auth.schema";
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

export default function VerificationCodePage() {
  const verifCodeForm = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter()

  const handleSubmit = (data: z.infer<typeof verificationCodeSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex lg:w-1/2 md:w-2/3 max-lg:px-5 max-sm:-mt-40 flex-col overflow-hidden md:border-2 md:border-black max-sm:mx-5">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-0">
          <Image
            src="/icon-email-verif-code.svg"
            className="max-sm:size-32"
            alt="Verification Code"
            width={250}
            height={250}
          />

          {!verifCodeForm.formState.isSubmitSuccessful ? (
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
                      Masukan Email Anda Untuk Melakukan Verifikasi Kode.
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
                Kirim
              </Button>
            </form>
          ) : (
            <>
            <CardTitle className="text-2xl">Verifikasi Email</CardTitle>
              <p className="text-center text-xl">
                Anda telah memasukan <span className="font-bold">{verifCodeForm.getValues("email")}</span> sebagai alamat
                email untuk akun anda silakan verifikasi alamat email ini dengan
                mengklik tombol di bawah.
              </p>
              <Button onClick={() => router.push("/one-time-password")}>Verifkasi Email</Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
