"use client";

import { Password } from "@/app/(modul 1 - auth)/_components/password";
import { useAuth } from "@/hooks/contollers/useAuth";
import { loginSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const LoginForm = () => {
  const { login } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
        email: "",
        password: "",
        rememberMe: false,
      },
    });

  const handleOnSubmit = (data: z.infer<typeof loginSchema>) => login(data);

  return (
    <form
      className="w-full space-y-5 px-10"
      id="register-form"
      onSubmit={loginForm.handleSubmit(handleOnSubmit)}
    >
      <FieldGroup>
        <Controller
          name={"email"}
          control={loginForm.control}
          render={({ field, fieldState }) => {
            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">
                  Email
                  <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  placeholder="john@example.com"
                  aria-invalid={fieldState.invalid}
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            );
          }}
        />
        <Controller
          name="password"
          control={loginForm.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">
                Password<span className="text-destructive">*</span>
              </FieldLabel>
              <Password id="password" field={field} fieldState={fieldState} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <Button form="register-form" type="submit">
            {loginForm.formState.isSubmitting ? (
              <Icon
                icon={"lucide:loader-circle"}
                width={24}
                className="animate-spin"
              />
            ) : (
              "Masuk"
            )}
          </Button>
          <p>
            Belum punya akun Pasjajan?{" "}
            <Link href="/register">
              <Button
                variant="link"
                disabled={loginForm.formState.isSubmitting}
              >
                Daftar
              </Button>
            </Link>
          </p>
          <div className="flex w-full justify-between">
            <Controller
              control={loginForm.control}
              name="rememberMe"
              render={({ field }) => (
                <Field orientation={"horizontal"}>
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FieldLabel htmlFor="rememberMe">Ingat Saya</FieldLabel>
                </Field>
              )}
            />

            <Link href="/forgot-password">
              <Button variant="link">Lupa Password?</Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            atau masuk menggunakan:
          </p>
          <Button variant={"ghost"} size="icon" className="size-14">
            <Icon icon="devicon:google" width="32" />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
