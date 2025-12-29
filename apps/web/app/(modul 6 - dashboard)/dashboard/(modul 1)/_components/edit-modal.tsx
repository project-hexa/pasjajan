"use client";

import { Password } from "@/app/(modul 1 - user management)/_components/password";
import { editUserSchema } from "@/app/(modul 1 - user management)/_schema/user.schema";
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import Cookies from "js-cookie";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const EditModal = ({
  user,
  open,
  onOpenChange,
}: {
  user: User;
  open?: boolean;
  onOpenChange?: (open: boolean) => boolean;
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  // const {} = useUserStore()
  const token = Cookies.get("token") ?? "";
  const editUserForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    mode: "onChange",
    defaultValues: {
      email: user.email,
      full_name: user.full_name,
      password: "",
      password_confirmation: "",
      phone_number: user.phone_number,
      role: user.role,
      status_account: user.status_account,
      token,
    },
  });

  const handleOnSubmit = async (data: z.infer<typeof editUserSchema>) => {
    const dirtyFields = editUserForm.formState.dirtyFields;
    const payload: Omit<typeof data, "token"> = Object.fromEntries(
      Object.keys(dirtyFields).map((key) => [
        key,
        data[key as keyof typeof data],
      ]),
    );

    console.log(payload);
  };

  return (
    <Dialog
      open={open ?? openModal}
      onOpenChange={onOpenChange ?? setOpenModal}
    >
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          onClick={() =>
            (onOpenChange && onOpenChange(!open)) ?? setOpenModal(!openModal)
          }
        >
          <Icon icon={"lucide:pencil"} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Akun</DialogTitle>
          <DialogDescription className="sr-only">
            Editing Akun User dari admin dashboard
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-user-form"
          className="flex flex-col items-center gap-4"
          onSubmit={editUserForm.handleSubmit(handleOnSubmit)}
        >
          <Controller
            control={editUserForm.control}
            name={"full_name"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="fullname">Nama Lengkap</FieldLabel>
                <FieldContent>
                  <Input
                    id="fullname"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editUserForm.control}
            name={"email"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <Input
                    id="email"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editUserForm.control}
            name={"phone_number"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="notelepon">No Telepon</FieldLabel>
                <FieldContent>
                  <Input
                    id="notelepon"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editUserForm.control}
            name={"password"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <Password
                    id="password"
                    field={field}
                    fieldState={fieldState}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editUserForm.control}
            name={"password_confirmation"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="password_confirm">
                  Konfirmasi Password
                </FieldLabel>
                <FieldContent>
                  <Password
                    id="password_confirm"
                    field={field}
                    fieldState={fieldState}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editUserForm.control}
            name={"role"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Role</FieldLabel>
                <FieldContent>
                  <Select
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Staff">Staff</SelectItem>
                      <SelectItem value="Customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editUserForm.control}
            name={"status_account"}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status Akun</FieldLabel>
                <FieldContent>
                  <Select
                    defaultValue={field.value}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Aktif</SelectItem>
                      <SelectItem value="Inactive">Tidak Aktif</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex w-3/4 justify-center gap-2">
            <Button form="edit-user-form" type="submit" className="flex-1">
              Simpan
            </Button>
            <Button
              type="button"
              variant={"destructive"}
              className="flex-1"
              onClick={() => {
                if (onOpenChange) {
                  onOpenChange(!open);
                } else {
                  setOpenModal(!openModal);
                }
                editUserForm.reset();
              }}
            >
              Batal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
