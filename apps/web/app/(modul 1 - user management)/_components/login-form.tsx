"use client";

import { Password } from "@/app/(modul 1 - user management)/_components/password";
import { useNavigate } from "@/hooks/useNavigate";
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
import { toast } from "@workspace/ui/components/sonner";
import Cookies from "js-cookie";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { authService } from "../_services/auth.service";
import { useUserStore } from "../_stores/useUserStore";

const cookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const pathname = usePathname();
  const { setUser, setIsLoggedIn } = useUserStore();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "Customer",
      rememberMe: false,
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
    console.log(data);
    
    const result = await authService.login({
      email: data.email,
      password: data.password,
      role: data.role,
    });

    if (result?.ok) {
      toast.success("Berhasil Masuk!", {
        toasterId: "global",
      });

      if (data.rememberMe) {
        Object.assign(cookiesOptions, { expires: 7 });
      }

      Cookies.set("token", result.data?.token ?? "", cookiesOptions);
      Cookies.set("role", result.data?.user_data.role, cookiesOptions);

      setUser(result.data?.user_data);
      setIsLoggedIn(true);

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
        if (result.errors.email_verified) {
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
                type="button"
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
              <Button variant="link" type="button">
                Lupa Password?
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground text-sm">
            atau masuk menggunakan:
          </p>
          <Button
            type="button"
            variant={"ghost"}
            size="icon"
            className="size-14"
          >
            <Icon icon="devicon:google" width="32" />
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
};
