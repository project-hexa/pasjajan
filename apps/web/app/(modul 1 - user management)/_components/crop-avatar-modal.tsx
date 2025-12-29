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
  formSetValue: UseFormReturn<{ avatar: File | null }>;
  onCancel?: () => void;
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const canvasToFile = (canvas: HTMLCanvasElement): Promise<File> => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error("Blob gagal dibuat");
        resolve(
          new File(
            [blob],
            `avatar.jpg`,
            {
              type: "image/*",
            },
          ),
        );
      }, "image/*");
    });
  };

  const getCroppedImage = async (
    imageSrc: string,
    crop: Area,
  ): Promise<File> => {
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

    return canvasToFile(canvas);
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

              const file = await getCroppedImage(rawImage, croppedAreaPixels);

              setCroppedImageUrl(URL.createObjectURL(file));
              formSetValue.setValue("avatar", file, {
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
