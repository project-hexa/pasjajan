"use client";

import { Password } from "@/app/(modul 1 - user management)/_components/password";
import { useNavigate } from "@/hooks/useNavigate";
import { registerSchema } from "@/lib/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@workspace/ui/components/button-group";
import { CardDescription } from "@workspace/ui/components/card";
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
import { toast } from "@workspace/ui/components/sonner";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { authService } from "../_services/auth.service";
import Cookies from "js-cookie";

const cookiesOptions: Cookies.CookieAttributes = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
};

export const RegisterForm = () => {
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
  const navigate = useNavigate();
  const phone = registerForm.watch("phone_number");

  useEffect(() => {
    if (phone.startsWith("+62")) {
      registerForm.setValue("phone_number", phone.slice(3));
    }

    if (phone.startsWith("0")) {
      registerForm.setValue("phone_number", phone.slice(1));
    }
  }, [phone, registerForm]);

  const handleOnSubmit = async (data: z.infer<typeof registerSchema>) => {
    const phone_number = data.phone_number.startsWith("0")
      ? "+62" + data.phone_number.slice(1)
      : "+62" + data.phone_number;
    data.phone_number = phone_number;

    const result = await authService.register(data);

    if (result.ok) {
      toast.success(result.message, {
        toasterId: "global",
      });

      Cookies.set("verificationStep", "email-sent", cookiesOptions);
      Cookies.set("pendingEmail", data.email, cookiesOptions);

      navigate.push("/send-otp");
    } else {
      toast.error(result.message, {
        description: result.description,
        toasterId: "global",
      });
    }
  };

  return (
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                <InputGroupAddon align={"block-end"} className="justify-end">
                  <InputGroupText>
                    {field.value?.length || 0}/200 karakter
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              <Password id="password" field={field} fieldState={fieldState} />
              <FieldDescription>
                Buat password menggunakan kombinasi huruf besar, huruf kecil,
                dan minimal 1 simbol.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                  registerForm.watch("password").length > 0 ? false : true
                }
              />
              <FieldDescription>Masukan kembali password.</FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
  );
};
