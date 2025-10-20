"use client";

import { Password } from "@/components/password";
import { loginSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@workspace/ui/components/input-group";
import { ChevronLeftCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import z from "zod";

export default function LoginPage() {
  const [showPhoneCode, setShowPhoneCode] = useState<boolean>(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      UET: "",
      password: "",
    },
  });

  const handleOnSubmit = (data: z.infer<typeof loginSchema>) => {
    data.UET = "62" + data.UET;
    console.log(data);
  };

  const UET = loginForm.watch("UET");

  useEffect(() => {
    if (UET && UET.length > 0) {
      if (/^(\+628|628|08)/.test(UET)) {
        setShowPhoneCode(true);
      } else {
        setShowPhoneCode(false);
      }

      const newValue = UET.replace(/^(?:\+628|628|08)/, "8");
      loginForm.setValue("UET", newValue);
    }

    if (/^8/.test(UET)) {
      setShowPhoneCode(true);
    } else {
      setShowPhoneCode(false);
    }
  }, [UET]);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Card className="p-0 w-2/3 h-2/3 overflow-hidden flex flex-col">
        <CardContent className="p-0 flex-1 min-h-0">
          <div className="flex h-full">
            <div className="bg-primary flex justify-center flex-1 items-center relative">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="absolute top-4 left-4 text-accent"
                >
                  <ChevronLeftCircle className="size-5" />
                  <span>Kembali ke Beranda</span>
                </Button>
              </Link>
              <div className="flex flex-col items-center text-white gap-5">
                <h1 className="text-4xl font-bold">Selamat datang</h1>
                <div className="flex flex-col items-center">
                  <Image src="/logo.png" alt="Logo" width={256} height={256} />
                  <h2 className="text-2xl font-bold">Pasjajan</h2>
                  <p className="text-sm">Belanja cepat dan Mudah</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col flex-1 items-center justify-center gap-4">
              <div className="flex flex-col shrink-0 items-center gap-4">
                <CardTitle className="text-2xl">Masuk</CardTitle>
                <CardDescription>
                  Belum punya akun Pasjajan?{" "}
                  <Link href="/register">
                    <Button variant="link">Daftar</Button>
                  </Link>
                </CardDescription>
              </div>

              <form
                className="w-full px-10 space-y-5"
                id="register-form"
                onSubmit={loginForm.handleSubmit(handleOnSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name={"UET"}
                    control={loginForm.control}
                    render={({ field, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="UET">
                            Username/Email/No Telepon
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <InputGroup className="relative">
                            {showPhoneCode && (
                              <InputGroupAddon className="bg-accent pr-3 rounded-l-md">
                                <InputGroupText>+62</InputGroupText>
                              </InputGroupAddon>
                            )}
                            <InputGroupInput
                              id="UET"
                              placeholder="johndoe_123 / john@example.com / 08123456789"
                              aria-invalid={fieldState.invalid}
                              {...field}
                            />
                          </InputGroup>
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
                </FieldGroup>

                <div className="flex flex-col items-center gap-2 justify-center">
                  <Button form="register-form" type="submit">
                    Masuk
                  </Button>
                  <p className="text-muted-foreground text-sm">
                    atau masuk menggunakan:
                  </p>
                  <Button variant={"ghost"} size="icon" className="size-14">
                    <FcGoogle className="size-10" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
