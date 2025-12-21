import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Waiting",
};

export default function PaymentWaitingLayout({children}: {children: ReactNode}) {
  return (
    <main>
        {children}
    </main>
  )
}
