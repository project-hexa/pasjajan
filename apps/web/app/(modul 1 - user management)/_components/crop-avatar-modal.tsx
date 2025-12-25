"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import { UseFormReturn } from "react-hook-form";

export const CropAvatarModal = ({
  setCroppedImageUrl,
  openCropper,
  setOpenCropper,
  rawImage,
  formSetValue,
  onCancel,
}: {
  setCroppedImageUrl: (url: string) => void;
  openCropper?: boolean;
  setOpenCropper?: (state: boolean) => void;
  rawImage: string | null;
  formSetValue: UseFormReturn;
  onCancel?: () => void;
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const getCroppedImage = async (
    imageSrc: string,
    crop: Area,
  ): Promise<string> => {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement("canvas");
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas context not available");
    }

    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height,
    );

    return canvas.toDataURL("image/*");
  };

  return (
    <Dialog open={openCropper ?? open} onOpenChange={setOpenCropper ?? setOpen}>
      <DialogContent
        className="flex flex-col items-center"
        showCloseButton={false}
        onInteractOutside={() => {
          if (onCancel) {
            onCancel();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Potong Gambar</DialogTitle>
          <DialogDescription className="sr-only">
            Potong Gambar Untuk Avatar Profil
          </DialogDescription>
        </DialogHeader>
        <div className="relative size-80">
          <Cropper
            image={rawImage ?? ""}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedPixels) => {
              setCroppedAreaPixels(croppedPixels);
            }}
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={async () => {
              if (!rawImage || !croppedAreaPixels) return;

              const croppedUrl = await getCroppedImage(
                rawImage,
                croppedAreaPixels,
              );

              setCroppedImageUrl(croppedUrl);
              formSetValue.setValue("avatar", croppedUrl, {
                shouldDirty: true,
                shouldValidate: true,
              });

              if (setOpenCropper) {
                setOpenCropper(false);
              } else {
                setOpen(false);
              }
            }}
          >
            Simpan
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              if (setOpenCropper) {
                setOpenCropper(false);
              } else {
                setOpen(false);
              }

              if (onCancel) {
                onCancel();
              }
            }}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
