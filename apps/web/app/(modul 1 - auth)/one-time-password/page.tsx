"use client";

import { otpSchema } from "@/lib/schema/auth.schema";
import { useAuthStore } from "@/stores/useAuthStore";
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
import { toast } from "@workspace/ui/components/sonner";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function OTPPage() {
  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      pin: "",
    },
  });
  const router = useRouter();
  const { verifyOTP, register, registerHold } = useAuthStore();

  const handleSubmit = async (data: z.infer<typeof otpSchema>) => {
    const result = await verifyOTP(data.pin);

    if (result.ok) {
      toast.success(result.message, {
        toasterId: "global",
      });

      register(registerHold!);
      router.push("/login");
    } else {
      toast.error(result.message, {
        toasterId: "global",
      });
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:mx-5 max-sm:-mt-40 md:border-2 md:border-black lg:h-2/3 lg:w-1/2">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center p-0">
          <form
            onSubmit={otpForm.handleSubmit(handleSubmit)}
            id="otpForm"
            className="flex flex-col items-center justify-center gap-4 max-lg:p-5"
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
                    containerClassName="gap-5 md:gap-10 justify-center"
                    {...field}
                  >
                    {[...Array(6)].map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        aria-invalid={fieldState.invalid}
                        className="max-sm:size-10"
                      />
                    ))}
                  </InputOTP>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
