"use client";

import { useLocationSearch } from "@/hooks/useLocationSearch";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { addAddressFormSchema } from "@/lib/schema/user.schema";
import { AddAddressFormSchema } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
} from "@workspace/ui/components/stepper";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { userService } from "../_services/user.service";
import { useUserStore } from "../_stores/useUserStore";
import { toast } from "@workspace/ui/components/sonner";

const MapsPicker = dynamic(
  () => import("@/components/maps-picker").then((mod) => mod.MapsPicker),
  {
    ssr: false,
    loading: () => <p>Memuat Peta...</p>,
  },
);

const steps = [
  {
    title: "Cari Lokasi Pengirimanmu",
  },
  {
    title: "Tentukan Pinpoint Lokasi",
  },
  {
    title: "Lengkapi Detail Alamat",
  },
];

interface LocationCoords {
  lat: number;
  lng: number;
}

export const AddAddress = ({ onSuccess }: { onSuccess: () => void }) => {
  const [initialMapLocation, setInitialMapLocation] =
    useState<LocationCoords | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [openAddAddressDialog, setOpenAddAddressDialog] =
    useState<boolean>(false);
  const [shouldAutoLocate, setShouldAutoLocate] = useState<boolean>(true);

  const { user } = useUserStore();
  const {
    query,
    results,
    isSearching,
    startSession,
    search,
    selectPlace,
    setQueryFromOutside,
  } = useLocationSearch();
  const { reverseGeocode } = useReverseGeocode();

  const addAddressForm = useForm<AddAddressFormSchema>({
    resolver: zodResolver(addAddressFormSchema),
    defaultValues: {
      pinpoint: "",
      label: "",
      detail_address: "",
      notes_address: "",
      phone_number: "",
      recipient_name: "",
      is_default: false,
    },
  });

  useEffect(() => {
    if (!openAddAddressDialog || !shouldAutoLocate) return;
    if (!("geolocation" in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setInitialMapLocation(coords);

        const address = await reverseGeocode(coords.lat, coords.lng);
        if (!address) return;

        setQueryFromOutside(address.place);

        addAddressForm.setValue("pinpoint", address.place);
        addAddressForm.setValue("detail_address", address.fullAddress);
        addAddressForm.setValue("recipient_name", user?.full_name || "");
        addAddressForm.setValue("phone_number", user?.phone_number || "");

        setShouldAutoLocate(false);
      },
      () => {
        console.warn("user deny location");
      },
    );
  }, [
    openAddAddressDialog,
    reverseGeocode,
    addAddressForm,
    user,
    setQueryFromOutside,
    shouldAutoLocate
  ]);

  useEffect(() => {
    if (openAddAddressDialog) {
      setCurrentStep(1);
    }
  }, [openAddAddressDialog]);

  const handleOnSubmit = async (
    data: Omit<AddAddressFormSchema, "pinpoint">,
  ) => {
    const res = await userService.addAddresses({
      email: user?.email || "",
      latitude: String(initialMapLocation?.lat) || "",
      longitude: String(initialMapLocation?.lng) || "",
      ...data,
    });

    if (res.ok) {
      toast.success(res.message || "Berhasil Menambah Alamat!", {
        toasterId: "global",
      });

      onSuccess();
      setOpenAddAddressDialog(false);
    } else {
      toast.error(res.message || "Gagal Menambah Alamat!", {
        toasterId: "global",
      });
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <Badge
          className="text-primary border-primary rounded-md p-2.5"
          variant={"outline"}
        >
          Semua Alamat
        </Badge>
        <Button
          onClick={() => {
            setOpenAddAddressDialog(true);
            setShouldAutoLocate(true);
          }}
        >
          Tambah Alamat
        </Button>
      </div>

      <Dialog
        open={openAddAddressDialog}
        onOpenChange={setOpenAddAddressDialog}
      >
        <DialogContent className="flex min-h-2/3 min-w-2/3 flex-col gap-4">
          <DialogTitle className="text-center">Tambah Alamat</DialogTitle>
          <DialogDescription className="sr-only">
            Tambah Alamat User
          </DialogDescription>
          <Stepper value={currentStep} onValueChange={setCurrentStep}>
            <StepperNav>
              {steps.map((s, i) => (
                <StepperItem key={s.title} step={i + 1}>
                  <div className="flex flex-col items-center gap-2.5">
                    <StepperIndicator className="data-[state=active]:bg-primary data-[state=completed]:bg-primary data-[state=completed]:text-primary-foreground data-[state=inactive]:text-muted-foreground data-[state=active]:text-primary-foreground">
                      {i + 1}
                    </StepperIndicator>
                    <StepperTitle>{s.title}</StepperTitle>
                  </div>
                  {steps.length > i + 1 && (
                    <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
                  )}
                </StepperItem>
              ))}
            </StepperNav>

            <StepperPanel className="mt-10 text-sm">
              <StepperContent
                value={1}
                className="flex flex-col items-center gap-2"
              >
                <h2 className="self-start text-lg font-bold">
                  Dimana Lokasi tujuan pengirimanmu?
                </h2>

                <div className="flex w-full flex-col items-center gap-5 h-80 justify-between">
                  <div className="relative w-full">
                    <InputGroup>
                      <InputGroupAddon>
                        <Icon icon="lucide:search" />
                      </InputGroupAddon>
                      <InputGroupInput
                        placeholder="Tulis Nama jalan"
                        value={query}
                        onFocus={startSession}
                        onChange={(e) => search(e.target.value)}
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
                            onClick={async () => {
                              const coords = await selectPlace(result);
                              if (coords) setInitialMapLocation(coords);
                            }}
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

                  <Button
                    className="w-1/2"
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                  >
                    Simpan
                  </Button>
                </div>
              </StepperContent>

              <StepperContent
                value={2}
                className="flex flex-col items-center gap-4"
              >
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

                        addAddressForm.setValue("pinpoint", address.place);
                      }}
                    />
                  )}
                </div>
                <Button
                  className="w-1/2"
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                >
                  Simpan
                </Button>
              </StepperContent>

              <StepperContent
                value={3}
                className="flex flex-col items-center gap-4 overflow-y-auto max-h-80"
              >
                <form
                  id="address-detail-form"
                  className="flex w-full flex-col items-center gap-4 pb-10"
                  onSubmit={addAddressForm.handleSubmit(handleOnSubmit)}
                >
                  <Controller
                    control={addAddressForm.control}
                    name="pinpoint"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Pinpoint</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Icon icon="lucide:map-pin" />
                            </InputGroupAddon>
                            <InputGroupInput
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
                    control={addAddressForm.control}
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
                    control={addAddressForm.control}
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
                    control={addAddressForm.control}
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
                    control={addAddressForm.control}
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
                              <RadioGroupItem
                                value="yes"
                                id="address-default-yes"
                              />
                              <FieldLabel htmlFor="address-default-yes">
                                Ya
                              </FieldLabel>
                            </Field>
                            <Field orientation={"horizontal"}>
                              <RadioGroupItem
                                value="no"
                                id="address-default-no"
                              />
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
                    control={addAddressForm.control}
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
                    control={addAddressForm.control}
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

                  <Button type="submit" form="address-detail-form" className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    {addAddressForm.formState.isSubmitting ? (
                      <Icon
                        icon={"lucide:loader-circle"}
                        width={24}
                        className="animate-spin"
                      />
                    ) : (
                      "Simpan"
                    )}
                  </Button>
                </form>
              </StepperContent>
            </StepperPanel>
          </Stepper>
        </DialogContent>
      </Dialog>
    </>
  );
};
