"use client";

import { Navbar } from "@/components/navigation-bar";
import { Footer } from "@/components/footer";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main className="mx-auto min-h-screen max-w-7xl bg-[#EEF6ED] px-4 py-10">
        {children}
      </main>

      <Footer />
    </>
  );
}
