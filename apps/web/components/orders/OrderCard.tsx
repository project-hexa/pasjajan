import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Item, ItemContent, ItemMedia } from "@workspace/ui/components/item";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Order } from "@/types/order.types";

interface OrderCardProps {
  order: Order;
  onBuyAgain?: (order: Order) => void;
}

const getStatusVariant = (
  status: string
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "completed":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "pending":
      return "outline";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: "Menunggu Pembayaran",
    confirmed: "Pembayaran Dikonfirmasi",
    processing: "Diproses",
    shipping: "Sedang Dikirim",
    delivered: "Telah Diterima",
    completed: "Selesai",
    cancelled: "Dibatalkan",
  };
  return statusMap[status] || status;
};

export function OrderCard({ order, onBuyAgain }: OrderCardProps) {
  const router = useRouter();
  const firstItem = order.items[0];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="sr-only">Order {order.code}</CardTitle>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <span className="text-sm">{formatDate(order.created_at)}</span>
            <Badge
              variant={getStatusVariant(order.status)}
              className="rounded-md"
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>
          <span className="text-sm">{order.code}</span>
        </div>
      </CardHeader>

      <CardContent>
        <Item>
          <ItemMedia>
            <Image
              src={
                firstItem?.product?.image_url ||
                "https://placehold.co/200x200.png"
              }
              alt={firstItem?.product?.name || "Product"}
              width={64}
              height={64}
              className="rounded-md"
            />
          </ItemMedia>
          <ItemContent>
            <span>{firstItem?.product?.name || "Produk"}</span>
            <span>Total: {itemCount} Pesanan</span>
          </ItemContent>
          <span className="ml-auto">
            Total Belanja {formatCurrency(order.grand_total)}
          </span>
        </Item>
      </CardContent>

      <CardFooter className="justify-between">
        <Button
          variant="link"
          onClick={() => router.push(`/payment/detail?order_code=${order.code}`)}
        >
          Lihat Detail Pesanan
        </Button>
        <div className="flex gap-2">
          {order.status === "pending" &&
            (order.payment_status === "unpaid" || order.payment_status === "pending") && (
              <Button
                variant="outline"
                onClick={() => {
                  // Jika sudah punya payment_method atau payment_instructions (transaksi sudah dibuat), arahkan ke waiting page
                  // Jika belum, arahkan ke payment page untuk pilih metode
                  if (order.payment_method || order.payment_instructions) {
                    router.push(`/payment/waiting?order=${order.code}`);
                  } else {
                    router.push(`/payment?order=${order.code}`);
                  }
                }}
              >
                {(order.payment_method || order.payment_instructions) ? "Lanjutkan Pembayaran" : "Bayar Sekarang"}
              </Button>
            )}
          {order.status === "completed" && onBuyAgain && (
            <Button onClick={() => onBuyAgain(order)}>Beli Lagi</Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
