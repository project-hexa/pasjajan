"use client";

import { editAddressFormSchema } from "@/app/(modul 1 - user management)/_schema/user.schema";
import { MapsPicker } from "@/components/maps-picker";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import {
  AddressSchema,
  EditAddressFormSchema,
  EditAddressSchema,
} from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
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
import { toast } from "@workspace/ui/components/sonner";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { userService } from "../_services/user.service";
import { useUserStore } from "../_stores/useUserStore";

interface LocationCoords {
  lat: number;
  lng: number;
}

export const EditAddressDialog = ({
  id,
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

  const {
    query,
    results,
    isSearching,
    startSession,
    search,
    selectPlace,
    setQueryFromOutside,
    resetSearch,
  } = useLocationSearch();

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

  const addressInDB = customer?.addresses.find(
    (a: AddressSchema) => a.id === id,
  );

  const [initialState, setInitialState] = useState<{
    map: LocationCoords | null;
    form: EditAddressFormSchema;
    query: string;
  } | null>(null);

  const resetAll = useCallback(() => {
    if (initialState) {
      setInitialMapLocation(initialState.map);
      editAddressForm.reset(initialState.form);
      setQueryFromOutside(initialState.query);
      resetSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openDialog || !addressInDB) return;

    const lat = Number(addressInDB.latitude);
    const lng = Number(addressInDB.longitude);

    const setAllInitial = (coords: LocationCoords | null, place: string) => {
      setInitialMapLocation(coords);
      editAddressForm.reset({
        detail_address: addressInDB.detail_address,
        is_default: addressInDB.is_default,
        label: addressInDB.label,
        pinpoint: addressInDB.detail_address,
        notes_address: addressInDB.notes_address,
        phone_number: addressInDB.phone_number,
        recipient_name: addressInDB.recipient_name,
        latitude: coords ? String(coords.lat) : "",
        longitude: coords ? String(coords.lng) : "",
      });
      setQueryFromOutside(place);
      setInitialState({
        map: coords,
        form: {
          detail_address: addressInDB.detail_address,
          is_default: addressInDB.is_default,
          label: addressInDB.label,
          pinpoint: addressInDB.detail_address,
          notes_address: addressInDB.notes_address,
          phone_number: addressInDB.phone_number,
          recipient_name: addressInDB.recipient_name,
          latitude: coords ? String(coords.lat) : "",
          longitude: coords ? String(coords.lng) : "",
        },
        query: place,
      });
    };

    if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      reverseGeocode(lat, lng).then((address) => {
        setAllInitial(
          { lat, lng },
          address?.place || addressInDB.detail_address,
        );
      });
    } else {
      search(addressInDB.detail_address).then(async (searchResults) => {
        if (Array.isArray(searchResults) && searchResults.length > 0) {
          const coords = {
            lat: searchResults[0].lat,
            lng: searchResults[0].lng,
          };
          setAllInitial(coords, addressInDB.detail_address);
        } else {
          setAllInitial(null, addressInDB.detail_address);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDialog, addressInDB]);

  const handleSelectSearchResult = async (result: {
    name: string;
    mapbox_id: string;
  }) => {
    const coords = await selectPlace(result);

    if (!coords) return;

    setInitialMapLocation(coords);

    editAddressForm.setValue("pinpoint", result.name, {
      shouldDirty: true,
      shouldTouch: true,
    });

    editAddressForm.setValue("latitude", String(coords.lat), {
      shouldDirty: true,
    });

    editAddressForm.setValue("longitude", String(coords.lng), {
      shouldDirty: true,
    });
  };

  const handleMapChange = async (coords: LocationCoords) => {
    setInitialMapLocation(coords);
    editAddressForm.setValue("latitude", String(coords.lat), {
      shouldDirty: true,
    });
    editAddressForm.setValue("longitude", String(coords.lng), {
      shouldDirty: true,
    });
    const address = await reverseGeocode(coords.lat, coords.lng);
    if (address) {
      editAddressForm.setValue("pinpoint", address.place, {
        shouldDirty: true,
      });
      setQueryFromOutside(address.place);
    }
  };

  const handleClose = () => {
    resetAll();
    setOpenDialog(false);
  };

  const handleOnSubmit = async (data: EditAddressFormSchema) => {
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
      } else if (key === "pinpoint" && data.pinpoint) {
        payload.detail_address = data.pinpoint;
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
      <DialogContent
        className="flex max-h-3/4 flex-col"
        onInteractOutside={handleClose}
        onCloseAutoFocus={handleClose}
      >
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
                        position={initialMapLocation}
                        onLocationChange={handleMapChange}
                      />
                    )}
                  </div>

                  <div className="relative w-full">
                    <InputGroup>
                      <InputGroupAddon>
                        <Icon icon="lucide:map-pin" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Tulis Nama jalan"
                        value={field.value}
                        onFocus={startSession}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          search(e.target.value);
                        }}
                      />
                    </InputGroup>

                    {isSearching &&
                      results.length === 0 &&
                      query.length > 2 && (
                        <div className="bg-card text-muted-foreground absolute top-full left-0 z-50 mt-2 w-full rounded-md border p-4 text-center shadow-lg">
                          <Icon
                            icon="lucide:loader-circle"
                            className="mx-auto mb-2 animate-spin"
                            width={24}
                          />
                          <p>Mencari lokasi...</p>
                        </div>
                      )}

                    {!isSearching && results.length > 0 && (
                      <ul className="bg-card absolute top-full left-0 z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-md border shadow-lg">
                        {results.map((result, idx) => (
                          <li
                            key={idx}
                            className="cursor-pointer border-b p-3 last:border-b-0 hover:bg-gray-100"
                            onClick={() => handleSelectSearchResult(result)}
                          >
                            {result.name}
                          </li>
                        ))}
                      </ul>
                    )}

                    {!isSearching &&
                      query.length > 0 &&
                      results.length === 0 &&
                      !initialMapLocation && (
                        <div className="bg-card text-muted-foreground absolute top-full left-0 z-50 mt-2 w-full rounded-md border p-4 text-center shadow-lg">
                          <Icon
                            icon="lucide:search-x"
                            className="mx-auto mb-2"
                            width={24}
                          />
                          <p>Lokasi tidak ditemukan</p>
                        </div>
                      )}
                  </div>
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
            <Button type="button" variant={"outline"} onClick={handleClose}>
              Batal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
