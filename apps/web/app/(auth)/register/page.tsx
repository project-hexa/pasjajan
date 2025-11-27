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
import { Label } from "@workspace/ui/components/label";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "@workspace/ui/components/sonner";
import z from "zod";
import { Icon } from "@workspace/ui/components/icon";

export default function RegisterPage() {
  const router = useRouter();

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullname: "",
      userName: "",
      email: "",
      noTelepon: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleOnSubmit = (data: z.infer<typeof registerSchema>) => {
    if (data.noTelepon) {
      data.noTelepon = "+62" + data.noTelepon.replace(/^(\+62|62|0)/, "");
    }

    toast.promise(
      new Promise<typeof registerForm>((resolve) => resolve(registerForm)),
      {
        loading: "Loading...",
        toasterId: "global",
        success: () => "Akun berhasil dibuat!",
        error: () => "Akun gagal dibuat",
      },
    );
    router.push("/verification-code");
    console.log(data);
  };

  return (
    <div className="items-center md:flex md:h-screen md:w-screen justify-center">
      <Card className="flex flex-col overflow-hidden p-0 max-sm:rounded-none md:h-2/3 md:w-2/3">
        <CardContent className="min-h-0 flex-1 p-0">
          <div className="flex h-full">
            <div className="bg-primary relative flex flex-1 items-center justify-center max-sm:hidden">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="text-accent absolute left-4 top-4"
                >
                  <Icon icon="lucide:circle-chevron-left" />
                  <span>Kembali ke Beranda</span>
                </Button>
              </Link>
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
                    name="fullname"
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
                    name="noTelepon"
                    control={registerForm.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="noTelepon">
                          No Telepon<span className="text-destructive">*</span>
                        </FieldLabel>
                        <ButtonGroup>
                          <ButtonGroupText asChild>
                            <Label htmlFor="noTelepon">+62</Label>
                          </ButtonGroupText>
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

                <div className="flex flex-col items-center justify-center gap-2">
                  <Button form="register-form" type="submit">
                    Daftar
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
