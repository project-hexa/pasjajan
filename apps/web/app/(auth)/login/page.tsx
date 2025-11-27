"use client";

import { Password } from "@/components/password";
import { useAuth } from "@/hooks/contollers/useAuth";
import { loginSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardTitle } from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import z from "zod";

export default function LoginPage() {
  const { login } = useAuth();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleOnSubmit = (data: z.infer<typeof loginSchema>) => {
    if (data.email === typeof Number) {
      data.email = "+62" + data.email;
    }

    login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe ?? false,
    });
  };

  return (
    <div className="md:flex md:h-screen md:w-screen items-center justify-center">
      <Card className="flex md:h-2/3 md:w-2/3 flex-col overflow-hidden p-0">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full max-sm:py-10">
            <div className="bg-primary relative flex flex-1 items-center justify-center max-sm:hidden">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-accent absolute left-4 top-4"
                >
                  <Icon
                    icon="lucide:circle-chevron-left"
                    width="24"
                    height="24"
                  />
                  <span>Kembali ke Beranda</span>
                </Button>
              </Link>
              <div className="flex flex-col items-center gap-5 text-white">
                <h1 className="lg:text-4xl md:text-2xl font-bold">Selamat datang</h1>
                <div className="flex flex-col items-center gap-5">
                  <Image src="/logo.png" alt="Logo" width={128} height={128} />
                  <div className="flex flex-col text-center">
                    <h2 className="text-2xl font-bold">Pasjajan</h2>
                    <p className="text-sm">Belanja cepat dan Mudah</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-4">
              <div className="flex shrink-0 flex-col items-center gap-4">
                <CardTitle className="text-2xl">Masuk</CardTitle>
              </div>

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
                            placeholder="johndoe_123 / john@example.com / 08123456789"
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
                        <Password
                          id="password"
                          field={field}
                          fieldState={fieldState}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  <div className="flex flex-col items-center justify-center gap-2">
                    <Button form="register-form" type="submit">
                      Masuk
                    </Button>
                    <p>
                      Belum punya akun Pasjajan?{" "}
                      <Link href="/register">
                        <Button variant="link">Daftar</Button>
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
                            <FieldLabel htmlFor="rememberMe">
                              Ingat Saya
                            </FieldLabel>
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
                      <FcGoogle className="size-10" />
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
