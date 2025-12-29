"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@workspace/ui/components/field";
import { Icon } from "@workspace/ui/components/icon";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import {
  AddressSchema,
  EditAddressFormSchema,
  EditAddressSchema,
} from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { editAddressFormSchema } from "@/app/(modul 1 - user management)/_schema/user.schema";
import { useUserStore } from "../_stores/useUserStore";
import { useEffect, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { toast } from "@workspace/ui/components/sonner";
import { MapsPicker } from "@/components/maps-picker";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { userService } from "../_services/user.service";

interface LocationCoords {
  lat: number;
  lng: number;
}

export const EditAddressDialog = ({
  id,
  pinpoint,
  onSuccess,
}: {
  id: number;
  pinpoint: string;
  onSuccess: () => void;
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [initialMapLocation, setInitialMapLocation] =
    useState<LocationCoords | null>(null);
  const { customer, user } = useUserStore();
  const { reverseGeocode } = useReverseGeocode();

  const editAddressForm = useForm<EditAddressFormSchema>({
    resolver: zodResolver(editAddressFormSchema),
    mode: "onChange",
    defaultValues: {
      detail_address: "",
      is_default: false,
      label: "",
      notes_address: "",
      phone_number: "",
      pinpoint: "",
      recipient_name: "",
      latitude: "",
      longitude: "",
    },
  });

  useEffect(() => {
    if (!customer) return;

    const address = customer.addresses.find((a: AddressSchema) => a.id === id);

    if (address) {
      const lat = Number(address.latitude);
      const lng = Number(address.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        setInitialMapLocation({ lat, lng });
      } else {
        setInitialMapLocation(null);
      }

      editAddressForm.reset({
        detail_address: address.detail_address,
        is_default: address.is_default,
        label: address.label,
        notes_address: address.notes_address,
        phone_number: address.phone_number,
        pinpoint: address.detail_address,
        recipient_name: address.recipient_name,
        latitude: address.latitude,
        longitude: address.longitude,
      });
    } else {
      setInitialMapLocation(null);
    }
  }, [customer, editAddressForm, id, pinpoint]);

  const handleOnSubmit = async (
    data: Omit<EditAddressFormSchema, "pinpoint">,
  ) => {
    const dirtyFields = editAddressForm.formState.dirtyFields;
    const payload: EditAddressSchema = {};

    if (Object.keys(dirtyFields).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan", {
        toasterId: "global",
      });
      return;
    }

    Object.keys(dirtyFields).forEach((key) => {
      if (key === "is_default" && data.is_default) {
        payload.is_default = data.is_default || false;
      } else {
        payload[key as keyof Omit<EditAddressSchema, "is_default">] = data[
          key as keyof typeof data
        ] as string;
      }
    });

    const res = await userService.editAddresses(id, {
      email: user?.email,
      ...payload,
    });

    if (res.ok) {
      toast.success(res.message || "Berhasil mengedit Alamat!", {
        toasterId: "global",
      });

      onSuccess();
      setOpenDialog(false);
    } else {
      toast.error(res.message || "gagal mengedit Alamat!", {
        toasterId: "global",
      });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button type="button" variant={"link"}>
          Ubah Alamat
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-3/4 flex-col">
        <DialogHeader>
          <DialogTitle>Ubah Alamat</DialogTitle>
          <DialogDescription className="sr-only">
            Form Ubah Alamat Customer
          </DialogDescription>
        </DialogHeader>
        <form
          id="address-edit-form"
          className="flex w-full flex-1 flex-col items-center gap-4 overflow-y-auto"
          onSubmit={editAddressForm.handleSubmit(handleOnSubmit)}
        >
          <Controller
            control={editAddressForm.control}
            name="pinpoint"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Pinpoint</FieldLabel>
                <FieldContent>
                  <div className="relative size-80 overflow-hidden rounded-md border">
                    {initialMapLocation && (
                      <MapsPicker
                        initialPosition={initialMapLocation}
                        onLocationChange={async (coords: LocationCoords) => {
                          const address = await reverseGeocode(
                            coords.lat,
                            coords.lng,
                          );
                          if (!address) return;

                          editAddressForm.setValue("pinpoint", address.place, {
                            shouldDirty: true,
                          });
                          editAddressForm.setValue(
                            "latitude",
                            String(coords.lat),
                            { shouldDirty: true },
                          );
                          editAddressForm.setValue(
                            "longitude",
                            String(coords.lng),
                            { shouldDirty: true },
                          );
                        }}
                      />
                    )}
                  </div>
                  <InputGroup>
                    <InputGroupAddon>
                      <Icon icon="lucide:map-pin" />
                    </InputGroupAddon>
                    <InputGroupInput
                      readOnly
                      className="read-only:opacity-70"
                      aria-invalid={fieldState.invalid}
                      {...field}
                    />
                  </InputGroup>
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editAddressForm.control}
            name="label"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Label Alamat</FieldLabel>
                <FieldContent>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editAddressForm.control}
            name="detail_address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Alamat Lengkap</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupTextarea
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
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editAddressForm.control}
            name="notes_address"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="notes_address">Catatan</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="contoh: dekat dengan ruko"
                    id="notes_address"
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
            control={editAddressForm.control}
            name="is_default"
            render={({ field }) => (
              <FieldGroup className="gap-2">
                <FieldLabel>Jadikan Alamat Utama</FieldLabel>
                <FieldContent>
                  <RadioGroup
                    value={field.value ? "yes" : "no"}
                    onValueChange={(v) => field.onChange(v === "yes")}
                  >
                    <Field orientation={"horizontal"}>
                      <RadioGroupItem value="yes" id="address-default-yes" />
                      <FieldLabel htmlFor="address-default-yes">Ya</FieldLabel>
                    </Field>
                    <Field orientation={"horizontal"}>
                      <RadioGroupItem value="no" id="address-default-no" />
                      <FieldLabel htmlFor="address-default-no">
                        Tidak
                      </FieldLabel>
                    </Field>
                  </RadioGroup>
                </FieldContent>
              </FieldGroup>
            )}
          />

          <Controller
            control={editAddressForm.control}
            name="recipient_name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nama Penerima</FieldLabel>
                <FieldContent>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={editAddressForm.control}
            name="phone_number"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nomor Telepon Penerima</FieldLabel>
                <FieldContent>
                  <Input aria-invalid={fieldState.invalid} {...field} />
                </FieldContent>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <DialogFooter>
            <Button type="submit" form="address-edit-form">
              {editAddressForm.formState.isSubmitting ? (
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
              variant={"outline"}
              onClick={() => {
                editAddressForm.reset();
                setOpenDialog(false);
              }}
            >
              Batal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
