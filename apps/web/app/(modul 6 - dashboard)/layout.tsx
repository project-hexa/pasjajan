import { Sidebar } from "./_components/sidebar";
import { Topbar } from "./_components/topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 bg-[#E9F4EE] p-4">
      <Topbar />
      <div className="flex gap-4">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
