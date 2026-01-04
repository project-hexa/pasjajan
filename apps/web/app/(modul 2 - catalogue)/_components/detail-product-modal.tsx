"use client";

import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@workspace/ui/components/dialog";
import Image from "next/image";
import { ComponentProps, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  unit: string;
};

const DetailProductModal = ({
  product,
  ...props
}: ComponentProps<"button"> & { product: Product }) => {
  const [prices, setPrices] = useState<number>(product.price);
  const [productCount, setProductCount] = useState<number>(1);

  const handleBtnMinus = () => {
    if (productCount > 1) {
      setProductCount((prev) => prev - 1);
      setPrices((prev) => prev - product.price);
    }
  };

  const handleBtnPlus = () => {
    setProductCount((prev) => prev + 1);
    setPrices((prev) => prev + product.price);
  };

  return (
    <Dialog>
      <DialogTrigger asChild {...props} />
      <DialogContent>
        <DialogHeader className="relative h-60 w-full">
          <Image src={product.image} alt={product.name} fill />
        </DialogHeader>

        <div className="flex justify-between">
          <DialogTitle>
            {product.name} - {product.unit}
          </DialogTitle>
          <div className="flex flex-col">
            <ButtonGroup>
              <Button variant={"outline"} onClick={handleBtnMinus}>
                -
              </Button>
              <Button variant={"outline"}>{productCount}</Button>
              <Button variant={"outline"} onClick={handleBtnPlus}>
                +
              </Button>
            </ButtonGroup>
            <span className="text-md text-destructive">
              Rp. {prices.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <DialogDescription>{product.description}</DialogDescription>

        <Button>Tambah Keranjang</Button>
      </DialogContent>
    </Dialog>
  );
};

export const DetailProductTrigger = ({
  product,
  ...props
}: ComponentProps<"button"> & { product: Product }) => {
  return (
    <DetailProductModal
      className="cursor-pointer"
      product={product}
      {...props}
    />
  );
};
