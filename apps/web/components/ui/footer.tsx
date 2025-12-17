import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { Item, ItemContent, ItemTitle } from "@workspace/ui/components/item";
import Image from "next/image";
import Link from "next/link";

const paymentMethods = [
  {
    name: "BCA",
    url: "/payment-methods/bca",
  },
  {
    name: "Mandiri",
    url: "/payment-methods/mandiri",
  },
  {
    name: "BNI",
    url: "/payment-methods/bni",
  },
  {
    name: "Permata Bank",
    url: "/payment-methods/permata-bank",
  },
  {
    name: "BRI",
    url: "/payment-methods/bri",
  },
  {
    name: "ShopeePay",
    url: "/payment-methods/shopeepay",
  },
  {
    name: "QRIS",
    url: "/payment-methods/qris",
  },
  {
    name: "Gopay",
    url: "/payment-methods/gopay",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-primary">
      <div className="grid w-full bg-background pb-5 rounded-br-full grid-cols-[repeat(1,auto)] gap-4 max-md:pb-10 lg:grid-cols-[repeat(4,auto)] lg:gap-10 items-start">
        <div className="bg-primary text-primary-foreground relative flex w-full md:w-max md:h-full items-center justify-between gap-4 md:gap-10 rounded-br-full px-4 md:px-10 py-5 md:shadow-[70px_-10px_0_-10px_var(--secondary)] shadow-[20px_0_0_-10px_var(--secondary)]">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-10 relative">
            <Image src="/logo-footer.png" alt="logo" fill />
            </div>
            <span className="text-lg md:text-2xl font-bold">PasJajan</span>
          </div>
          <p className="max-w-[250px] font-bold">
            Solusi belanja kelontong dalam genggaman.
          </p>
        </div>
        <Item>
          <ItemContent>
            <ItemTitle className="text-xl font-bold">Bantuan</ItemTitle>
            <Link href="" className="w-max">
              <Button variant="link" className="text-secondary-foreground h-max">
                Tentang Kami
              </Button>
            </Link>
            <Link href="" className="w-max">
              <Button variant="link" className="text-secondary-foreground h-max">
                Keamanan dan Privasi
              </Button>
            </Link>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle className="text-xl font-bold">
              Metode Pembayaran
            </ItemTitle>
            <div className="grid grid-cols-2 gap-2">
              {paymentMethods.map((pm, i) => (
                <Link href={pm.url} className="w-max" key={i}>
                  <Button
                    variant="link"
                    className="text-secondary-foreground h-max"
                  >
                    {pm.name}
                  </Button>
                </Link>
              ))}
            </div>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle className="text-xl font-bold">Ikuti Kami</ItemTitle>
            <div className="flex gap-2">
              <Link href="" className="w-max">
                <Button variant="ghost" size={"icon"}>
                  <Icon icon={"lucide:instagram"} width={32} />
                </Button>
              </Link>
              <Link href="" className="w-max">
                <Button variant="ghost" size={"icon"}>
                  <Icon icon="ic:baseline-facebook" width={32} />
                </Button>
              </Link>
              <Link href="" className="w-max">
                <Button variant="ghost" size={"icon"}>
                  <Icon icon="ic:baseline-tiktok" width={32} />
                </Button>
              </Link>
            </div>
          </ItemContent>
        </Item>
      </div>

      <p className="text-primary-foreground text-center text-sm py-2">
        &copy; 2025 PasJajan - All Right Reserved
      </p>
    </footer>
  );
};
