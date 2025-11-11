import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground grid w-full grid-cols-[repeat(4,auto)] gap-10 p-5">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image src="/logo.png" alt="logo" width={128} height={128} />
        <span className="text-2xl font-bold">PasJajan</span>
      </div>
      <div className="flex flex-col gap-2">
        <span className="font-bold">Ikuti Kami</span>
        <div className="flex items-center gap-2">
          <Link href="">
            <Button variant={"outline"} size={"icon"}>
              <Icon icon={"skill-icons:instagram"} width={24} />
            </Button>
          </Link>
          <Link href="">
            <Button variant={"outline"} size={"icon"}>
              <Icon icon={"logos:tiktok-icon"} width={24} />
            </Button>
          </Link>
        </div>

        <span className="font-bold">Hubungi kami</span>
        <Link href="mailto:contact@pasjajan.com">
          <Button
            variant={"link"}
            className="text-primary-foreground p-0 has-[>svg]:p-0"
          >
            <Mail /> pasjajan@gmail.com
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-bold">Metode Pembayaran</span>
        <div className="items- flex gap-2">
          <Link href="">
            <Button variant={"outline"}>
              <Image src="/qris.svg" alt="qris" width={64} height={32} />
            </Button>
          </Link>
          <Link href="">
            <Button
              variant={"ghost"}
              size="icon"
              className="p-0 has-[>svg]:p-0"
            >
              <Image src="/gopay.svg" alt="gopay" width={32} height={32} />
            </Button>
          </Link>
          <Link href="">
            <Button variant={"outline"}>
              <Image src="/shopee.svg" alt="shopee" width={64} height={32} />
            </Button>
          </Link>
          <Link href="">
            <Button variant={"outline"}>
              <Image src="/dana.svg" alt="dana" width={64} height={32} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-10 max-w-md">
        <span className="font-bold">Layanan Pengaduan Konsumen</span>
        <p className="text-center max-w-[270px]">
          Direktorat Jenderal Perlindungan Konsumen dan tata tertib Niaga
          kementerian perdangangan Republik Indonesia
        </p>
      </div>

      <div className="col-span-full text-center">
        <span className="font-bold">&copy;2025 PT. PasJajan</span>
      </div>
    </footer>
  );
};
