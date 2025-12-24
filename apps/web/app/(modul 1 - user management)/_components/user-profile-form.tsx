"use client";

import { editProfileSchema } from "@/lib/schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { toast } from "@workspace/ui/components/sonner";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { id } from "date-fns/locale";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { userService } from "../_services/user.service";
import { useUserStore } from "../_stores/useUserStore";

export const UserProfileForm = () => {
  const [editingFields, setEditingFields] = useState<
    Set<keyof z.infer<typeof editProfileSchema>>
  >(new Set());

  const { user } = useUserStore();

  const profileForm = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      email_before: "",
      token: "",
      full_name: "",
      email: "",
      phone_number: "",
      gender: null,
      birth_date: null,
    },
  });

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender ? user.gender : null,
      birth_date: user.birth_date ? user.birth_date : null,
    });
  }, [user, profileForm]);

  const handleBtnEdit = (field: keyof z.infer<typeof editProfileSchema>) => {
    setEditingFields((prev) => new Set(prev).add(field));
    profileForm.setFocus(field);
  };

  const handleBtnCancelEdit = (
    field: keyof z.infer<typeof editProfileSchema>,
  ) => {
    setEditingFields((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
    profileForm.resetField(field);
  };

  const handleSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    const dirtyFields = profileForm.formState.dirtyFields;
    const payload: Omit<z.infer<typeof editProfileSchema>, "birth_date"> & {
      birth_date?: string;
    } = {
      email_before: user?.email ?? "",
      token: Cookies.get("token") ?? "",
    };

    if (Object.keys(dirtyFields).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan", {
        toasterId: "global",
      });
      return;
    }

    Object.keys(dirtyFields).forEach((key) => {
      if (key === "birth_date" && data.birth_date) {
        payload.birth_date = new Date(
          data.birth_date.year!,
          data.birth_date.month! - 1,
          data.birth_date.day!,
        )
          .toISOString()
          .split("T")[0];
      } else if (key === "gender" && data.gender) {
        payload.gender = data.gender;
      } else {
        payload[
          key as keyof Omit<
            z.infer<typeof editProfileSchema>,
            "birth_date" | "gender"
          >
        ] = data[key as keyof typeof data] as string;
      }
    });

    const result = await userService.editUserProfile(payload);

    if (result.ok) {
      toast.success(result.message, {
        toasterId: "global",
      });

      setEditingFields(new Set());
    } else {
      toast.error(result.message, {
        toasterId: "global",
      });
    }
  };

  return (
    <form
      className="space-y-4"
      id="profile-form"
      onSubmit={profileForm.handleSubmit(handleSubmit)}
    >
      <div className="flex justify-between">
        <div className="flex flex-1 flex-col gap-4 py-10">
          <Controller
            name="full_name"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="grid grid-cols-[200px_1fr_100px]"
              >
                <FieldLabel className="w-20">Nama Lengkap</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  <Input
                    className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                    readOnly={!editingFields.has("full_name")}
                    {...field}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {!editingFields.has(field.name) ? (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnEdit(field.name)}
                  >
                    Ubah
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnCancelEdit(field.name)}
                  >
                    Batal
                  </Button>
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="grid grid-cols-[200px_1fr_100px]"
              >
                <FieldLabel>Email</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  <Input
                    className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                    readOnly={!editingFields.has("email")}
                    {...field}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {!editingFields.has(field.name) ? (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnEdit(field.name)}
                  >
                    Ubah
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnCancelEdit(field.name)}
                  >
                    Batal
                  </Button>
                )}
              </Field>
            )}
          />
          <Controller
            name="phone_number"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="grid grid-cols-[200px_1fr_100px]"
              >
                <FieldLabel>No Telepon</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  <Input
                    className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                    readOnly={!editingFields.has("phone_number")}
                    {...field}
                  />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {!editingFields.has(field.name) ? (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnEdit(field.name)}
                  >
                    Ubah
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnCancelEdit(field.name)}
                  >
                    Batal
                  </Button>
                )}
              </Field>
            )}
          />
          <Controller
            name="gender"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="grid grid-cols-[200px_1fr_100px]"
              >
                <FieldLabel>Jenis Kelamin</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  {!editingFields.has("gender") ? (
                    user?.gender ? (
                      <FieldLabel>{user.gender}</FieldLabel>
                    ) : (
                      <FieldLabel className="text-muted-foreground">
                        Jenis Kelamin belum di atur
                      </FieldLabel>
                    )
                  ) : (
                    <RadioGroup
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <div className="flex items-center gap-5">
                        <Field orientation={"horizontal"}>
                          <RadioGroupItem value="Laki-Laki" id={"laki-laki"} />
                          <Label htmlFor="laki-laki">Laki-Laki</Label>
                        </Field>
                        <Field orientation={"horizontal"}>
                          <RadioGroupItem value="Perempuan" id={"perempuan"} />
                          <FieldLabel htmlFor="perempuan">Perempuan</FieldLabel>
                        </Field>
                      </div>
                    </RadioGroup>
                  )}
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
                {!editingFields.has(field.name) ? (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnEdit(field.name)}
                  >
                    Ubah
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnCancelEdit(field.name)}
                  >
                    Batal
                  </Button>
                )}
              </Field>
            )}
          />
          <Controller
            name="birth_date"
            control={profileForm.control}
            render={({ field: { value, ...field }, fieldState }) => (
              <Field
                className="grid grid-cols-[200px_1fr_100px]"
                data-invalid={fieldState.invalid}
              >
                <FieldLabel>Tanggal Lahir</FieldLabel>
                <div className="flex flex-col">
                  <FieldContent className="flex-row items-center gap-4">
                    {!editingFields.has(field.name) ? (
                      !(value && value.day && value.month && value.year) ? (
                        <FieldLabel className="text-muted-foreground">
                          Tanggal Lahir belum di atur
                        </FieldLabel>
                      ) : (
                        <div className="grid grid-cols-[repeat(3,128px)] gap-4">
                          <Input
                            className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                            readOnly={true}
                            value={value.day}
                          />
                          <Input
                            className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                            readOnly={true}
                            value={value.month}
                          />
                          <Input
                            className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                            readOnly={true}
                            value={value.year}
                          />
                        </div>
                      )
                    ) : (
                      <div className="grid grid-cols-[repeat(3,128px)] gap-4">
                        <Select
                          value={value?.day?.toString() ?? ""}
                          onValueChange={(v) => {
                            field.onChange({ ...value, day: Number(v) });
                            setTimeout(
                              () => profileForm.trigger("birth_date"),
                              0,
                            );
                          }}
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Tanggal" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map(
                              (d) => (
                                <SelectItem key={d} value={String(d)}>
                                  {d}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <Select
                          value={value?.month?.toString() ?? ""}
                          onValueChange={(v) => {
                            field.onChange({ ...value, month: Number(v) });
                            setTimeout(
                              () => profileForm.trigger("birth_date"),
                              0,
                            );
                          }}
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Bulan" />
                          </SelectTrigger>
                          <SelectContent>
                            {eachMonthOfInterval({
                              start: startOfYear(new Date()),
                              end: endOfYear(new Date()),
                            })
                              .map((date) => ({
                                label: format(date, "MMMM", { locale: id }),
                              }))
                              .map((m, i) => (
                                <SelectItem key={i} value={String(i + 1)}>
                                  {m.label}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Select
                          value={value?.year?.toString() ?? ""}
                          onValueChange={(v) => {
                            field.onChange({ ...value, year: Number(v) });
                            setTimeout(
                              () => profileForm.trigger("birth_date"),
                              0,
                            );
                          }}
                        >
                          <SelectTrigger
                            className="w-full"
                            aria-invalid={fieldState.invalid}
                          >
                            <SelectValue placeholder="Tahun" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 100 }, (_, i) => {
                              const y = new Date().getFullYear() - i;
                              return (
                                <SelectItem key={y} value={String(y)}>
                                  {y}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </FieldContent>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </div>
                {!editingFields.has(field.name) ? (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnEdit(field.name)}
                  >
                    Ubah
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={"link"}
                    onClick={() => handleBtnCancelEdit(field.name)}
                  >
                    Batal
                  </Button>
                )}
              </Field>
            )}
          />
        </div>

        <div className="flex w-80 flex-col items-center gap-4 border-l py-10">
          <Avatar className="size-40 object-cover">
            <AvatarFallback>U</AvatarFallback>
            <AvatarImage
              src={user?.avatar || "/img/user-profile.png"}
              alt={`avatar ${user?.full_name || "user profile"}`}
            />
          </Avatar>

          <Button type="button">Ubah Profile</Button>

          <div className="text-muted-foreground flex flex-col text-center text-sm">
            <span>Ukuran Gambar: maks 2 MB</span>
            <span>Format Gambar: JPG, JPEG, PNG</span>
          </div>
        </div>
      </div>

      {editingFields.size > 0 && (
        <Button type="submit" form="profile-form" className="mb-4">
          Simpan
        </Button>
      )}
    </form>
  );
};
