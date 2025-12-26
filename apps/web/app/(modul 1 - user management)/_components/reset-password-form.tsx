"use client";

import { Password } from "@/app/(modul 1 - user management)/_components/password";
import { Button } from "@workspace/ui/components/button";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Controller } from "react-hook-form";
import { useResetPassword } from "../_hooks/useResetPassword";

export const ResetPasswordForm = () => {
  const { resetPassForm, handleSubmit } = useResetPassword();

  return (
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
            <Password id="password" field={field} fieldState={fieldState} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
  );
};
