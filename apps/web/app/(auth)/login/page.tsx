"use client";

import { Password } from "@/components/password";
import { loginSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardTitle
} from "@workspace/ui/components/card";
import { Checkbox } from "@workspace/ui/components/checkbox";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "@workspace/ui/components/sonner";
import z from "zod";

export default function LoginPage() {
  const [showPhoneCode, setShowPhoneCode] = useState<boolean>(false);
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      UET: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleOnSubmit = (data: z.infer<typeof loginSchema>) => {
    data.UET = "+62" + data.UET;
    toast.promise(
      new Promise<typeof loginForm>((resolve) => resolve(loginForm)),
      {
        loading: "Loading...",
        toasterId: "global",
        success: () => "Berhasil Masuk!",
        error: () => "Gagal Masuk!",
      },
    );
    router.push("/");
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
  }, [UET, loginForm]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Card className="flex h-2/3 w-2/3 flex-col overflow-hidden p-0">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full">
            <div className="bg-primary relative flex flex-1 items-center justify-center">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-accent absolute top-4 left-4"
                >
                  <ChevronLeftCircle className="size-5" />
                  <span>Kembali ke Beranda</span>
                </Button>
              </Link>
              <div className="flex flex-col items-center gap-5 text-white">
                <h1 className="text-4xl font-bold">Selamat datang</h1>
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
                              <InputGroupAddon className="bg-accent rounded-l-md pr-3">
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
                    <div className="flex justify-between w-full">
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
