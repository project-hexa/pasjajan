"use client";

import { otpSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { InputOTP, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function OTPPage() {
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof otpSchema>) => {
    console.log(data);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex h-2/3 w-1/2 flex-col overflow-hidden border-2 border-black p-0">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center p-0">
          <form
            onSubmit={otpForm.handleSubmit(handleSubmit)}
            id="otpForm"
            className="flex flex-col items-center justify-center gap-4"
          >
            <Controller
              control={otpForm.control}
              name="pin"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="sr-only">One-Time Password</FieldLabel>
                  <FieldDescription className="max-w-md">
                    Kami telah mengirimkan kode OTP ke example@example.com,
                    silahkan masukan kode OTP anda.
                  </FieldDescription>
                  <InputOTP
                    maxLength={6}
                    containerClassName="gap-10"
                    {...field}
                  >
                    <InputOTPSlot index={0} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={1} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={2} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={3} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={4} aria-invalid={fieldState.invalid} />
                    <InputOTPSlot index={5} aria-invalid={fieldState.invalid} />
                  </InputOTP>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <p className="self-start">
              Kirim ulang kode OTP?{" "}
              <Button variant={"link"} className="p-0" type="button">
                Kirim Ulang
              </Button>
            </p>

            <Button type="submit" form="otpForm">
              Kirim
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
