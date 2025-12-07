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
  { name: "Instagram", icon: "/img/ig.png" },
  { name: "Facebook", icon: "/img/facebook.svg" },
  { name: "TikTok", icon: "/img/tiktok.png" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-16 w-full bg-[#125635] border-t border-white/20">
      <div className="relative isolate mx-auto max-w-[1920px] overflow-hidden px-6 pb-16 pt-20 text-white sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="hidden h-full w-full lg:block">
            <div
              aria-hidden
              className="absolute"
              style={{
                width: 2303,
                height: 839,
                top: -484,
                left: -653,
                borderRadius: 302,
                background: "#FFFFFF",
                zIndex: 1,
              }}
            />
            <div
              aria-hidden
              className="absolute"
              style={{
                width: 1393,
                height: 957,
                top: -642,
                left: -732,
                borderRadius: 302,
                background: "#125635",
                zIndex: 3,
              }}
            />
            <div
              aria-hidden
              className="absolute"
              style={{
                width: 1430,
                height: 540,
                top: -305,
                left: -646,
                borderRadius: 302,
                background: "#FDDE13",
                zIndex: 2,
              }}
            />
          </div>

          <div className="h-full w-full lg:hidden">
            <div
              aria-hidden
              className="absolute -left-2/3 inset-y-0 w-[160%] rounded-r-full bg-[#125635]"
              style={{ zIndex: 3 }}
            />
            <div
              aria-hidden
              className="absolute -top-24 right-[20%] h-64 w-64 rounded-full bg-[#FDDE13]"
              style={{ zIndex: 2 }}
            />
            <div
              aria-hidden
              className="absolute -right-[35%] bottom-[-35%] h-72 w-[120%] rounded-t-[240px] bg-[#125635]"
              style={{ zIndex: 2 }}
            />
            <div
              aria-hidden
              className="absolute -top-[18%] -left-[15%] h-[140%] w-[140%] rounded-[220px] bg-white"
              style={{ zIndex: 1 }}
            />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-6 text-white md:max-w-sm -ml-6 md:-ml-16">
            <div className="flex items-center gap-4">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <Image
                  src="/img/logo3.png"
                  alt="PasJajan"
                  width={112}
                  height={112}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
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
              <h3 className="text-lg font-semibold text-[#111827]">FAQ</h3>
              <ul className="space-y-2 text-sm text-[#1F2937]">
                <li>Apa itu PasJajan?</li>
                <li>Bagaimana cara berbelanja di PasJajan?</li>
                <li>Metode pembayaran apa saja yang tersedia di PasJajan?</li>
                <li>Bagaimana cara melacak status pesanan saya?</li>
              </ul>
            </div>

            <div className="md:absolute md:right-4 md:top-4 z-20 static md:flex md:flex-col md:gap-3">
              <h3 className="text-lg font-semibold text-[#111827]">Ikuti kami</h3>
              <div className="flex items-center gap-4">
                {socialLinks.map(({ name, icon }) => (
                  <button
                    key={name}
                    type="button"
                    aria-label={name}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-[#111827] shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:bg-white"
                    // intentionally disabled to prevent navigating to external apps
                  >
                    <Image
                      src={icon}
                      alt={name}
                      width={20}
                      height={20}
                      className="h-5 w-5 object-contain"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#125635] py-4">
        <p className="text-center text-xs font-medium text-white">© 2025 PasJajan – All Right Reserved</p>
      </div>
    </footer>
  );
}
