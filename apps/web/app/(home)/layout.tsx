import { BottomBar } from "@/components/ui/bottom-bar";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";

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
      </main>
      <BottomBar />
      <Footer />
    </>
  );
}
