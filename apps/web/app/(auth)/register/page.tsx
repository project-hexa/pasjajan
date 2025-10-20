"use client";

import { Password } from "@/components/password";
import { registerSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@workspace/ui/components/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group";
import { ChevronLeftCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import z from "zod";

export default function RegisterPage() {
  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      noTelepon: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleOnSubmit = (data: z.infer<typeof registerSchema>) => {
    console.log(data);
  };

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

            <div className="flex flex-col flex-1 items-center gap-4 overflow-y-auto py-4">
              <div className="flex flex-col shrink-0 items-center gap-4">
                <CardTitle className="text-2xl">Daftar</CardTitle>
                <CardDescription>
                  Sudah memiliki akun Pasjajan?{" "}
                  <Link href="/login">
                    <Button variant="link">Masuk</Button>
                  </Link>
                </CardDescription>
              </div>

              <form
                className="w-full px-10 space-y-5"
                id="register-form"
                onSubmit={registerForm.handleSubmit(handleOnSubmit)}
              >
                <FieldGroup>
                  <div className="grid grid-cols-2 gap-2">
                    <Controller
                      name="firstName"
                      control={registerForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="firstName">
                            Nama Depan
                            <span className="text-destructive">*</span>
                          </FieldLabel>
                          <Input
                            id="firstName"
                            placeholder="John"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                    <Controller
                      name="lastName"
                      control={registerForm.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="lastName">
                            Nama Belakang (Optional)
                          </FieldLabel>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <Controller
                    name="userName"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="userName">
                          Username<span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id="userName"
                          placeholder="johndoe_123"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="email">
                          Email (Optional)
                        </FieldLabel>
                        <Input
                          id="email"
                          placeholder="Example@example.com"
                          aria-invalid={fieldState.invalid}
                          {...field}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="noTelepon"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="noTelepon">
                          No Telepon<span className="text-destructive">*</span>
                        </FieldLabel>
                        <ButtonGroup>
                          <ButtonGroupText>+62</ButtonGroupText>
                          <Input
                            id="noTelepon"
                            placeholder="81234567890"
                            aria-invalid={fieldState.invalid}
                            {...field}
                          />
                        </ButtonGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="address"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="address">
                          Address (Optional)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            id="address"
                            placeholder="Jl. Setiabudhi No.123, Bandung"
                            aria-invalid={fieldState.invalid}
                            rows={6}
                            className="resize-none min-h-24"
                            {...field}
                          />
                          <InputGroupAddon
                            align={"block-end"}
                            className="justify-end"
                          >
                            <InputGroupText>
                              {field.value?.length || 0}/200 karakter
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password"
                    control={registerForm.control}
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
                        <FieldDescription>
                          Buat password menggunakan kombinasi huruf besar, huruf
                          kecil, angka, dan simbol {'(!@#$%^&*(),.?":{}|<>)'}.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="confirmPassword"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm Password
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Password
                          id="confirmPassword"
                          field={field}
                          fieldState={fieldState}
                          disabled={
                            registerForm.watch("password").length > 0
                              ? false
                              : true
                          }
                        />
                        <FieldDescription>
                          Masukan kembali password.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="flex flex-col items-center gap-2 justify-center">
                  <Button form="register-form" type="submit">
                    Daftar
                  </Button>
                  <p className="text-muted-foreground text-sm">
                    atau daftar menggunakan:
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
