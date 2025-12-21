"use client";

import { verifyOTPSchema } from "@/lib/schema/auth.schema";
import { useAuthStore } from "@/stores/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { InputOTP, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { toast } from "@workspace/ui/components/sonner";
import { useNavigate } from "@/hooks/useNavigate";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import Cookies from "js-cookie";

export default function OTPPage() {
  const navigate = useNavigate();
  const { verifyOTP, sendOTP } = useAuthStore();
  const [emailForOTP, setEmailForOTP] = useState<string>("");
  const otpForm = useForm<z.infer<typeof verifyOTPSchema>>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      email: emailForOTP,
      otp: "",
    },
  });
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [isMaxAttempt, setIsMaxAttempt] = useState(false);

  useEffect(() => {
    const email = Cookies.get("pendingEmail") || "";
    setEmailForOTP(email);
    otpForm.setValue("email", email);
  }, [otpForm]);

  const handleOnSubmit = async (data: z.infer<typeof verifyOTPSchema>) => {
    const result = await verifyOTP({ email: emailForOTP, otp: data.otp });

    if (result.ok) {
      toast.success(result.message, {
        toasterId: "global",
      });

      Cookies.remove("OTP_attempt_count");
      Cookies.remove("OTP_expires_at");
      navigate.push("/");
    } else {
      toast.error(result.message, {
        toasterId: "global",
      });
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleResendOTP = async () => {
    setIsResending(true);

    const result = await sendOTP({ email: emailForOTP });

    if (result.ok) {
      toast.success(result.message, { toasterId: "global" });
      otpForm.resetField("otp")

      const newAttemptCount = attemptCount + 1;
      setAttemptCount(newAttemptCount);
      Cookies.set("OTP_attempt_count", String(newAttemptCount));

      const waitTimeInSeconds = (newAttemptCount * 2 + 1) * 60;
      const expireTime = Date.now() + waitTimeInSeconds * 1000;
      Cookies.set("OTP_expires_at", String(expireTime));

      setCountdown(waitTimeInSeconds);
      setCanResend(false);

      if (newAttemptCount >= 3) {
        setIsMaxAttempt(true);
      }
    } else {
      if (
        result.message?.includes("tiga kali") ||
        result.message?.includes("admin")
      ) {
        setIsMaxAttempt(true);
        toast.error(result.message, { toasterId: "global" });
      } else {
        toast.error(result.message, { toasterId: "global" });
      }
    }

    setIsResending(false);
  };

  useEffect(() => {
    const savedAttempt = Cookies.get("OTP_attempt_count");
    const savedExpireTime = Cookies.get("OTP_expires_at");

    if (savedAttempt) {
      const attempt = parseInt(savedAttempt);
      setAttemptCount(attempt);

      if (attempt >= 3) {
        setIsMaxAttempt(true);
      }
    }

    if (savedExpireTime) {
      const expireTime = new Date(savedExpireTime).getTime();
      const now = Date.now();
      const remainingSeconds = Math.floor((expireTime - now) / 1000);

      if (remainingSeconds > 0) {
        setCountdown(remainingSeconds);
        setCanResend(false);
      } else {
        setCountdown(0);
        setCanResend(true);
        Cookies.remove("OTP_expires_at");
      }
    } else {
      setCanResend(true);
    }
  }, []);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:mx-5 max-sm:-mt-40 md:border-2 md:border-black lg:min-h-2/3 lg:min-w-1/2">
        <CardContent className="flex min-h-0 flex-1 flex-col items-center justify-center p-0">
          <form
            onSubmit={otpForm.handleSubmit(handleOnSubmit)}
            id="otpForm"
            className="flex flex-col items-center justify-center gap-4 max-lg:p-5"
          >
            <Controller
              control={otpForm.control}
              name="otp"
              render={({ field, fieldState }) => (
                <Field className="px-4">
                  <FieldLabel className="sr-only">One-Time Password</FieldLabel>
                  <FieldDescription className="max-w-md">
                    Kami telah mengirimkan kode OTP ke {emailForOTP}, silahkan
                    masukan kode OTP anda.
                  </FieldDescription>
                  <FieldContent>
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
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <p className="self-start px-4">
              {isMaxAttempt ? (
                <span className="text-destructive text-sm">
                  OTP telah dikirim lebih dari 3 kali. Harap hubungi admin.
                </span>
              ) : (
                <>
                  Kirim ulang kode OTP?{" "}
                  <Button
                    variant={"link"}
                    className="p-0"
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isResending || !canResend}
                  >
                    {!canResend ? (
                      `Tunggu ${Math.floor(countdown / 60)}m ${countdown % 60}s`
                    ) : isResending ? (
                      <Icon
                        icon={"lucide:loader-circle"}
                        width={24}
                        className="animate-spin"
                      />
                    ) : (
                      "Kirim Ulang"
                    )}
                  </Button>
                </>
              )}
            </p>

            <Button
              form="otpForm"
              type="submit"
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting ? (
                <Icon
                  icon={"lucide:loader-circle"}
                  width={24}
                  className="animate-spin"
                />
              ) : (
                "Kirim"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
