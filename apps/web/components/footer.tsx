import Image from "next/image";
import Link from "next/link";

const supportLinks = ["Tentang Kami", "Keamanan dan Privasi"];

const paymentMethods = [
  "BCA",
  "BNI",
  "BRI",
  "QRIS",
  "Mandiri",
  "Permata Bank",
  "Shopee Pay",
  "Gopay",
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/pasjajan",
    icon: (
      <Image
        src="/img/ig.png"
        alt="Instagram"
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
      />
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/pasjajan",
    icon: (
      <Image
        src="/img/facebook.svg"
        alt="Facebook"
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
      />
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@pasjajan",
    icon: (
      <Image
        src="/img/tiktok.png"
        alt="TikTok"
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
      />
    ),
  },
];

export const Footer = () => {
  return (
    <footer className="mt-16 w-full">
      <div className="relative isolate overflow-hidden rounded-t-[48px] bg-white">
        <div
          className="absolute inset-y-0 left-[-8%] w-[70%] rounded-r-[320px] bg-[#0F5230]"
          aria-hidden
        />
        <div
          className="absolute -top-24 right-[18%] h-72 w-72 rounded-full bg-[#FFCF25]"
          aria-hidden
        />
        <div
          className="absolute -bottom-32 right-[-12%] h-64 w-[55%] rounded-t-full bg-[#0F5230]"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="flex flex-col gap-6 text-white md:max-w-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 p-2 backdrop-blur-sm">
                <Image
                  src="/img/logo2.png"
                  alt="PasJajan"
                  width={88}
                  height={88}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <span className="text-3xl font-semibold">PasJajan</span>
            </div>
            <p className="text-lg font-semibold leading-relaxed md:text-xl">
              Solusi Belanja Kelontong
              <span className="block">dalam Genggaman.</span>
            </p>
          </div>

          <div className="grid w-full gap-10 text-[#0A1F14] md:grid-cols-3 md:gap-12">
            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[#111827]">Bantuan</h3>
              <ul className="space-y-2 text-sm text-[#1F2937]">
                {supportLinks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[#111827]">Metode Pembayaran</h3>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-[#1F2937]">
                {paymentMethods.map((method) => (
                  <li key={method}>{method}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-lg font-semibold text-[#111827]">Ikuti kami</h3>
              <div className="flex items-center gap-4">
                {socialLinks.map(({ name, href, icon }) => (
                  <Link
                    key={name}
                    href={href}
                    aria-label={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    prefetch={false}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#111827] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-white"
                  >
                    {icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0F5230] py-4">
        <p className="text-center text-xs font-medium text-white">
          © 2025 PasJajan – All Right Reserved
        </p>
      </div>
    </footer>
  );
};
