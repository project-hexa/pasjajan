import Image from "next/image";
import { Button } from "@workspace/ui/components/button";

interface VoucherProps {
  title: string;
  expiry: string;
  image: string;
}

export function VoucherItem({ title, expiry, image }: VoucherProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src={image} alt="Voucher" width={50} height={50} />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-gray-500">S/D: {expiry}</p>
        </div>
      </div>

      <Button className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700">
        Pakai
      </Button>
    </div>
  );
}
