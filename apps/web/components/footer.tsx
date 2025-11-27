import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground grid w-full lg:grid-cols-[repeat(4,auto)] grid-cols-[repeat(2,auto)] gap-4 lg:gap-10 p-5 max-md:pb-10">
      <div className="flex flex-col items-center justify-center gap-2 max-lg:col-span-2">
        <Image src="/logo.png" alt="logo" width={128} height={128} />
        <span className="text-2xl font-bold">PasJajan</span>
      </div>
      <div className="flex flex-col gap-2 max-lg:items-center max-lg:pt-5">
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

        <div className="flex flex-col max-lg:items-center">
          <span className="font-bold">Hubungi kami</span>
          <Link href="mailto:contact@pasjajan.com">
            <Button
              variant={"link"}
              className="text-primary-foreground p-0 has-[>svg]:p-0"
            >
              <Icon icon="lucide:mail" /> pasjajan@gmail.com
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-2 max-lg:pt-5">
        <span className="font-bold">Metode Pembayaran</span>
        <div className="flex gap-2 max-sm:flex-wrap">
          <Link href="">
            <Button variant={"outline"} className="relative w-16 h-8">
              <Image src="/qris.svg" alt="qris" fill />
            </Button>
          </Link>
          <Link href="">
            <Button
              variant={"outline"}
              size="icon"
              className="relative w-8 h-8"
            >
              <Image src="/gopay.svg" alt="gopay" fill />
            </Button>
          </Link>
          <Link href="">
            <Button variant={"outline"} className="relative w-16 h-8">
              <Image src="/shopee.svg" alt="shopee" fill />
            </Button>
          </Link>
          <Link href="">
            <Button variant={"outline"} className="relative w-16 h-8">
              <Image src="/dana.svg" alt="dana" fill className="scale-150" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:gap-10 gap-4 max-lg:col-span-2 max-lg:items-center max-lg:pt-5">
        <span className="font-bold">Layanan Pengaduan Konsumen</span>
        <p className="max-w-[270px] text-center">
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
