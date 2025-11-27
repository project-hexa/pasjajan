import { BottomBar } from "@/components/bottom-bar";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navigation-bar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar className="sticky top-0 z-50" />
      <main className="flex-1 overflow-y-auto">
        {children}
        <Footer />
      </main>
      <BottomBar />
    </>
  );
}
