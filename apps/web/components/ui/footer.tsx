import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import { Icon } from "@workspace/ui/components/icon";
import { Item, ItemContent, ItemTitle } from "@workspace/ui/components/item";
import Image from "next/image";
import Link from "next/link";

export const faqs: { question: string; answer?: string }[] = [
  {
    question: "Apa itu PasJajan?",
    answer:
      "PasJajan adalah platform e-commerce untuk belanja kebutuhan sehari-hari dan produk lainnya secara online.",
  },
  {
    question: "Bagaimana cara berbelanja di PasJajan?",
    answer:
      "Buat akun atau masuk, cari produk, masukkan ke keranjang, pilih metode pengiriman dan pembayaran, lalu konfirmasi pesanan. Setelah bayar, pantau status pesanan di halaman 'Pesanan'.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia di PasJajan?",
    answer:
      "Kami menerima transfer bank, kartu kredit/debit, e-wallet populer (mis. GoPay, OVO, Dana), dan opsi COD di wilayah tertentu.",
  },
  {
    question: "Bagaimana cara melacak status pesanan saya?",
    answer:
      "Buka halaman 'Pesanan' di akun Anda, pilih pesanan terkait untuk melihat status pengiriman dan nomor resi. Untuk masalah lebih lanjut, hubungi penjual atau dukungan pelanggan.",
  },
];

export const Footer = () => {
  return (
    <footer className="bg-primary border-r">
      <div className="bg-background grid w-full grid-cols-[repeat(1,auto)] items-start gap-4 overflow-x-hidden pb-5 max-md:pb-10 lg:grid-cols-[repeat(4,auto)] lg:gap-10">
        <div className="bg-primary text-primary-foreground relative flex w-full items-center justify-between gap-4 rounded-br-full px-4 py-5 shadow-[20px_0_0_-10px_var(--secondary)] md:h-60 md:w-max md:gap-10 md:px-10 md:shadow-[50px_-10px_0_-10px_var(--secondary)]">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="relative h-32 w-38">
              <Image
                src="/img/logo-footer.png"
                alt="logo"
                fill
                sizes="(max-width: 768px) 100vw, 200px"
              />
            </div>
            <span className="text-lg font-bold md:text-4xl">PasJajan</span>
          </div>
          <p className="max-w-62.5 font-bold">
            Solusi Belanja Kelontong Dalam Genggaman.
          </p>
        </div>
        <Item>
          <ItemContent>
            <ItemTitle className="text-xl font-bold">Bantuan</ItemTitle>
            <Link href="" className="w-max">
              <Button
                variant="link"
                className="text-secondary-foreground h-max"
              >
                Tentang Kami
              </Button>
            </Link>
            <Link href="" className="w-max">
              <Button
                variant="link"
                className="text-secondary-foreground h-max"
              >
                Keamanan dan Privasi
              </Button>
            </Link>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle className="text-xl font-bold">FAQ</ItemTitle>
            <Accordion type="single" defaultValue={`faq-1`}>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i + 1}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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

      <p className="text-primary-foreground py-2 text-center text-sm">
        &copy; 2025 PasJajan - All Right Reserved
      </p>
    </footer>
  );
};
