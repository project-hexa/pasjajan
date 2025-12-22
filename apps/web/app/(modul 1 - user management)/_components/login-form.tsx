"use client";

import { Password } from "@/app/(modul 1 - user management)/_components/password";
import { loginSchema } from "@/lib/schema/auth.schema";
import { useAuthStore } from "@/stores/useAuthStore";
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
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigate } from "@/hooks/useNavigate";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useEffect } from "react";
import Cookies from "js-cookie";

export const LoginForm = () => {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const pathname = usePathname();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      role: "Customer",
    },
  });

  useEffect(() => {
    if (pathname === "/login/admin") {
      loginForm.setValue("role", "Admin");
    } else {
      loginForm.setValue("role", "Customer");
    }
  }, [pathname, loginForm]);

  const handleOnSubmit = async (data: z.infer<typeof loginSchema>) => {
    const result = await login(data);

    if (result?.ok) {
      toast.success("Berhasil Masuk!", {
        toasterId: "global",
      });

      if (pathname === "/login/admin" && data.role === "Admin") {
        navigate.push("/dashboard");
      } else if (pathname === "/login" && data.role === "Customer") {
        navigate.push("/");
      }
    } else {
      toast.error(result.message, {
        description: result.description,
        toasterId: "global",
      });

      if (result.errors) {
        if (result.errors.email_verified === false) {
          if (Cookies.get("verificationStep") === "otp-sent") {
            navigate.push("/one-time-password");
          } else {
            Cookies.set("verificationStep", "email-sent");
            Cookies.set("pendingEmail", loginForm.getValues("email"));
            navigate.push("/send-otp");
          }
        }
      }
    }
  };

  return (
    <form
      className="w-full space-y-5 px-10"
      id="login-form"
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
          <Button form="login-form" type="submit">
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
