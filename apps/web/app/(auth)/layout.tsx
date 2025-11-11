import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navigation-bar";

export default function AuthLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navbar className="sticky top-0 z-50" />
      <main className="overflow-y-auto">
        {children}
        <Footer />
      </main>
    </>
  )
}