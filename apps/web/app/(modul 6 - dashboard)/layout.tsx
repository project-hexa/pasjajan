import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen space-y-4 bg-[#E9F4EE] p-4 pr-0">
      <div className="flex h-full flex-col gap-4">
        <Topbar />
        <div className="flex gap-4 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto pr-4">{children}</main>
        </div>
      </div>
    </div>
  );
}
