import { Toaster } from "@workspace/ui/components/sonner";
import "@workspace/ui/globals.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

const fontSans = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PasJajan - SmartMart",
    template: "%s | PasJajan",
  },
  description:
    "Aplikasi kasir modern untuk usaha makanan dan minuman. Kelola transaksi, stok, dan laporan dengan mudah dan aman.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "PasJajan - SmartMart",
    description: "Aplikasi kasir modern untuk usaha makanan dan minuman.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "PasJajan",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PasJajan - SmartMart",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PasJajan - SmartMart",
    description: "Aplikasi kasir modern untuk usaha makanan dan minuman.",
    images: ["/og-image.png"],
  },
  robots: "index, follow",
  themeColor: "#1E8F59",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`font-sans ${fontSans.variable} min-h-svh w-full overflow-y-auto antialiased`}
      >
        <NextTopLoader color={"#d92"} showSpinner={false} />
        {children}
        <Toaster
          position="top-center"
          style={
            {
              "--normal-bg": "var(--primary)",
              "--normal-text": "var(--primary-foreground)",
              "--toast-close-button-end": "2",
            } as React.CSSProperties
          }
          closeButton
          toastOptions={{
            classNames: { closeButton: "toaster-close-btn", toast: "toaster" },
          }}
          richColors
          theme="light"
          id="global"
          offset={100}
        />
      </body>
    </html>
  );
}
