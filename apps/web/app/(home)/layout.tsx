import { BottomBar } from "@/components/ui/bottom-bar";
import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/navigation-bar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar className="sticky top-0 z-50" />
      <main className="-mt-10 flex-1 overflow-x-hidden overflow-y-auto">
        {children}
        <Footer />
      </main>
      <BottomBar />
    </div>
  );
}
