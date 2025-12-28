"use client";

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
import {
  Dropzone,
  DropzoneEmptyState,
} from "@workspace/ui/components/shadcnio/dropzone";
import { eachMonthOfInterval, endOfYear, format, startOfYear } from "date-fns";
import { id } from "date-fns/locale";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useEditProfile } from "../_hooks/useEditProfile";
import { useUserStore } from "../_stores/useUserStore";
import { CropAvatarModal } from "./crop-avatar-modal";
import { Icon } from "@workspace/ui/components/icon";

export const UserProfileForm = () => {
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [openCropper, setOpenCropper] = useState(false);

  const { user } = useUserStore();

  const {
    profileForm,
    croppedImageUrl,
    editingFields,
    files,
    handleBtnCancelEdit,
    handleBtnEdit,
    handleOnSubmit,
    setCroppedImageUrl,
    changeAvatarForm,
    handleUploadAvatar,
  } = useEditProfile();

  const handleDrop = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setRawImage(imageUrl);
    setOpenCropper(true);
  };

  return (
    <div className="flex justify-between">
      <form
        className="space-y-4"
        id="profile-form"
        onSubmit={profileForm.handleSubmit(handleOnSubmit)}
      >
        <div className="flex flex-1 flex-col gap-4 py-10">
          <Controller
            name="full_name"
            control={profileForm.control}
            render={({ field, fieldState }) => (
              <Field
                data-invalid={fieldState.invalid}
                className="grid grid-cols-[200px_1fr_100px]"
              >
                <FieldLabel htmlFor="fullname" className="w-20">
                  Nama Lengkap
                </FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  <Input
                    id="fullname"
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  <Input
                    id="email"
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
                <FieldLabel htmlFor="telpon">No Telepon</FieldLabel>
                <FieldContent className="flex-row items-center gap-4">
                  <Input
                    id="telpon"
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

        {editingFields.size > 0 && (
          <Button type="submit" form="profile-form" className="mb-4">
            {profileForm.formState.isSubmitting ? (
              <Icon
                icon={"lucide:loader-circle"}
                width={24}
                className="animate-spin"
              />
            ) : (
              "Simpan"
            )}
          </Button>
        )}
      </form>
      <form
        id="change-avatar"
        onSubmit={changeAvatarForm.handleSubmit(handleUploadAvatar)}
      >
        <Controller
          control={changeAvatarForm.control}
          name="avatar"
          render={() => (
            <Field className="w-80">
              <FieldContent className="flex flex-col items-center gap-4 border-l px-4 py-10">
                <Avatar className="size-40 object-cover">
                  <AvatarFallback>U</AvatarFallback>
                  <AvatarImage
                    src={
                      croppedImageUrl || user?.avatar || "/img/user-profile.png"
                    }
                    alt={`avatar ${user?.full_name || "user profile"}`}
                  />
                </Avatar>

                <CropAvatarModal
                  openCropper={openCropper}
                  setOpenCropper={setOpenCropper}
                  rawImage={rawImage}
                  setCroppedImageUrl={setCroppedImageUrl}
                  formSetValue={changeAvatarForm}
                />

                {croppedImageUrl ? (
                  <>
                    <Button type="submit" form="change-avatar">
                      {changeAvatarForm.formState.isSubmitting ? (
                        <Icon
                          icon={"lucide:loader-circle"}
                          width={24}
                          className="animate-spin"
                        />
                      ) : (
                        "Simpan"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCroppedImageUrl("")}
                    >
                      Batal
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    className="hover:text-primary-foreground"
                    asChild
                  >
                    <Dropzone
                      maxSize={1024 * 1024 * 2}
                      minSize={1024}
                      onDrop={(e) => {
                        handleDrop(e);
                      }}
                      onError={console.error}
                      src={files}
                      accept={{ "image/*": [] }}
                    >
                      <DropzoneEmptyState>Ubah Profile</DropzoneEmptyState>
                    </Dropzone>
                  </Button>
                )}
                <div className="flex flex-col items-center text-xs">
                  <span>Ukuran Gambar: Maks 2MB</span>
                  <span>Format Gambar: JPG, JPEG, PNG</span>
                </div>
              </FieldContent>
            </Field>
          )}
        />
      </form>
    </div>
  );
};
