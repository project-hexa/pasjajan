import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment",
};

export default function PaymentLayout({children}: {children: ReactNode}) {
  return (
    <main>
        {children}
    </main>
  )
}
