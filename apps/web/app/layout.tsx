import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navigation-bar";
import { ThemeProviders } from "@/components/theme-providers";
import "@workspace/ui/globals.css";
import { Poppins } from "next/font/google";

const fontSans = Poppins({
  weight: ["300"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${fontSans.variable} antialiased h-screen w-screen container mx-auto overflow-y-auto`}
      >
        <ThemeProviders>
          <Navbar />
          <main>
            {children}
            <Footer />
          </main>
        </ThemeProviders>
      </body>
    </html>
  );
}
