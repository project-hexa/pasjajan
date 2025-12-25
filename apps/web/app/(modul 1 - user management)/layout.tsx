"use client";

import { BottomBar } from "@/components/ui/bottom-bar";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (pathname === "/login/admin") {
    return (
      <>
        <main>{children}</main>
        <BottomBar />
      </>
    );
  }

  return (
    <>
      <Navbar className="sticky top-0 z-50" />
      <main className="overflow-y-auto -mt-10">
        {children}
        <Footer />
      </main>
      <BottomBar />
    </>
  );
}
