import { ThemeProviders } from "@/components/theme-providers";
import "@workspace/ui/globals.css";
import { Poppins } from "next/font/google";

const fontSans = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans ${fontSans.variable} min-h-svh w-full overflow-y-auto antialiased`}
      >
        <ThemeProviders>{children}</ThemeProviders>
      </body>
    </html>
  );
}
