"use client";

import { useAuthStore } from "@/stores/useAuthStore";
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
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const profileSchema = z.object({
  full_name: z
    .string()
    .min(3, "Nama lengkap minimal harus 3 karakter")
    .max(30, "Nama lengkap maksimal 30 karakter"),
  email: z.string().email("Email tidak Valid"),
  phone_number: z.string(),
  gender: z.enum(["Laki-Laki", "Perempuan"]),
  birthday: z
    .object({
      day: z.number().int().min(1).max(31).optional(),
      month: z.number().int().min(1).max(12).optional(),
      year: z.number().int().min(1900).optional(),
    })
    .refine((v) => v.day && v.month && v.year, {
      message: "Tanggal lahir wajib lengkap",
    }),
});

export const UserProfileForm = () => {
  const [editingFields, setEditingFields] = useState<
    Set<keyof z.infer<typeof profileSchema>>
  >(new Set());

  const { user } = useAuthStore();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      gender: undefined,
      birthday: undefined,
    },
  });

  useEffect(() => {
    if (!user) return;

    profileForm.reset({
      full_name: user.full_name,
      email: user.email,
      phone_number: user.phone_number,
      gender: user.gender,
      birthday: {
        day: user.birth_date && new Date(user.birth_date).getDate(),
        month: user.birth_date && new Date(user.birth_date).getMonth(),
        year: user.birth_date && new Date(user.birth_date).getFullYear(),
      },
    });
  }, [user, profileForm]);

  const handleBtnEdit = (field: keyof z.infer<typeof profileSchema>) => {
    setEditingFields((prev) => new Set(prev).add(field));
    profileForm.setFocus(field);
  };

  const handleBtnCancelEdit = (field: keyof z.infer<typeof profileSchema>) => {
    setEditingFields((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
    profileForm.resetField(field);
  };

  const handleSubmit = (data: z.infer<typeof profileSchema>) => {
    console.log(data);
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
                    aria-invalid={fieldState.invalid}
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
                    aria-invalid={fieldState.invalid}
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
                    aria-invalid={fieldState.invalid}
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
                      value={field.value}
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
            name="birthday"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="grid grid-cols-[200px_1fr_100px]"
              >
                <FieldLabel>Tanggal Lahir</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  {!editingFields.has(field.name) ? (
                    !(
                      field.value &&
                      field.value.day &&
                      field.value.month &&
                      field.value.year
                    ) ? (
                      <FieldLabel className="text-muted-foreground">
                        Tanggal Lahir belum di atur
                      </FieldLabel>
                    ) : (
                      <div className="grid grid-cols-[repeat(3,128px)] gap-4">
                        <Input
                          className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                          readOnly={true}
                          value={field.value.day}
                        />
                        <Input
                          className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                          readOnly={true}
                          value={field.value.month}
                        />
                        <Input
                          className="read-only:focus-visible:border-border read-only:text-muted-foreground flex-1 read-only:caret-transparent read-only:focus-visible:ring-0"
                          readOnly={true}
                          value={field.value.year}
                        />
                      </div>
                    )
                  ) : (
                    <div className="grid grid-cols-[repeat(3,128px)] gap-4">
                      <Select
                        value={field.value?.day?.toString()}
                        onValueChange={(v) =>
                          field.onChange({ ...field.value, day: Number(v) })
                        }
                      >
                        <SelectTrigger className="w-full">
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
                        value={field.value?.month?.toString()}
                        onValueChange={(v) =>
                          field.onChange({ ...field.value, month: Number(v) })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Bulan" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (m) => (
                              <SelectItem key={m} value={String(m)}>
                                {m}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                      <Select
                        value={field.value?.year?.toString()}
                        onValueChange={(v) =>
                          field.onChange({ ...field.value, year: Number(v) })
                        }
                      >
                        <SelectTrigger className="w-full">
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
