import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navigation-bar";

export default function HomeLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navbar />
      <main className="overflow-y-auto flex-1">
        {children}
      </main>
    </>
  )
}