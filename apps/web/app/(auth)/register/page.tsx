"use client";

import { Password } from "@/components/auth/password";
import { useAuth } from "@/hooks/contollers/useAuth";
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
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group";
import { Label } from "@workspace/ui/components/label";
import Image from "next/image";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function RegisterPage() {
  const { register } = useAuth();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      address: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleOnSubmit = (data: z.infer<typeof registerSchema>) => {
    const phone_number = data.phone_number.startsWith("0")
      ? "+62" + data.phone_number.slice(1)
      : "+62" + data.phone_number;
    data.phone_number = phone_number;
    
    register(data);
  };

  return (
    <div className="items-center justify-center md:flex md:h-screen md:w-screen">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:rounded-none md:h-2/3 md:w-2/3">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full">
            <div className="bg-primary relative flex flex-1 items-center justify-center max-sm:hidden">
              <div className="flex flex-col items-center gap-5 text-white">
                <h1 className="text-4xl font-bold">Selamat datang</h1>
                <div className="flex flex-col items-center gap-5">
                  <Image src="/logo.png" alt="Logo" width={128} height={128} />
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold">Pasjajan</h2>
                    <p className="text-sm">Belanja cepat dan Mudah</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col items-center gap-4 overflow-y-auto py-4">
              <CardTitle className="text-2xl">Daftar</CardTitle>
              <form
                className="w-full space-y-5 px-10"
                id="register-form"
                onSubmit={registerForm.handleSubmit(handleOnSubmit)}
              >
                <FieldGroup>
                  <Controller
                    name="full_name"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="fullname">
                          Nama Lengkap
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Input
                          id="fullname"
                          placeholder="John Doe"
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
                          Email<span className="text-destructive">*</span>
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
                    name="phone_number"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="phone_number">
                          No Telepon<span className="text-destructive">*</span>
                        </FieldLabel>
                        <ButtonGroup>
                          <ButtonGroupText asChild>
                            <Label htmlFor="phone_number">+62</Label>
                          </ButtonGroupText>
                          <Input
                            id="phone_number"
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
                          Address<span className="text-destructive">*</span>
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            id="address"
                            placeholder="Jl. Setiabudhi No.123, Bandung"
                            aria-invalid={fieldState.invalid}
                            rows={6}
                            className="min-h-24 resize-none"
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
                          Buat password menggunakan kombinasi huruf besar, dan
                          huruf kecil.
                        </FieldDescription>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <Controller
                    name="password_confirmation"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password_confirmation">
                          Confirm Password
                          <span className="text-destructive">*</span>
                        </FieldLabel>
                        <Password
                          id="password_confirmation"
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

                <div className="flex flex-col items-center justify-center gap-2">
                  <Button
                    form="register-form"
                    type="submit"
                    disabled={registerForm.formState.isSubmitting}
                  >
                    {registerForm.formState.isSubmitting ? (
                      <Icon
                        icon={"lucide:loader-circle"}
                        width={24}
                        className="animate-spin"
                      />
                    ) : (
                      "Daftar"
                    )}
                  </Button>
                  <div className="flex shrink-0 flex-col items-center gap-4">
                    <CardDescription>
                      Sudah memiliki akun Pasjajan?{" "}
                      <Link href="/login">
                        <Button variant="link">Masuk</Button>
                      </Link>
                    </CardDescription>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    atau daftar menggunakan:
                  </p>
                  <Button variant={"ghost"} size="icon" className="size-14">
                    <Icon icon="devicon:google" width="32" />
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
