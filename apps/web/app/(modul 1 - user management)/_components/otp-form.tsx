"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { InputOTP, InputOTPSlot } from "@workspace/ui/components/input-otp";
import { Controller } from "react-hook-form";
import { useOTP } from "../_hooks/useOTP";

export const OTPForm = () => {
  const {
    otpForm,
    emailForOTP,
    isMaxAttempt,
    isResending,
    canResend,
    countdown,
    handleResendOTP,
    handleOnSubmit,
  } = useOTP();

  return (
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
              Kami telah mengirimkan kode OTP ke {emailForOTP}, silahkan masukan
              kode OTP anda.
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <ResendOTPButton
        isMaxAttempt={isMaxAttempt}
        isResending={isResending}
        canResend={canResend}
        countdown={countdown}
        onResend={handleResendOTP}
      />

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
  );
};

const ResendOTPButton = ({
  isMaxAttempt,
  isResending,
  canResend,
  countdown,
  onResend,
}: {
  isMaxAttempt: boolean;
  isResending: boolean;
  canResend: boolean;
  countdown: number;
  onResend: () => Promise<void>;
}) => {
  if (isMaxAttempt) {
    return (
      <p className="self-start px-4">
        <span className="text-destructive text-sm">
          OTP telah dikirim lebih dari 3 kali. Harap hubungi admin.
        </span>
      </p>
    );
  }
  return (
    <p className="self-start px-4">
      Kirim ulang kode OTP?{" "}
      <Button
        variant={"link"}
        className="p-0"
        type="button"
        onClick={onResend}
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
    </p>
  );
};
