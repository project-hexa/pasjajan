import * as React from "react";
import { Card, CardContent, CardFooter } from "./card";
import { Button } from "./button";
import { cn } from "../lib/utils";

export interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  image: string;
  name: string;
  description?: string;
  price: number;
  onAddToCart?: () => void;
}

const ProductCard = React.forwardRef<HTMLDivElement, ProductCardProps>(
  ({ className, image, name, description, price, onAddToCart, ...props }, ref) => {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "decimal",
        minimumFractionDigits: 0,
      }).format(price);
    };

    return (
      <Card ref={ref} className={cn("overflow-hidden", className)} {...props}>
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          <p className="font-bold text-lg mt-2 text-red-600">
            Rp. {formatPrice(price)}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={onAddToCart}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            Tambah
          </Button>
        </CardFooter>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";

export { ProductCard };
