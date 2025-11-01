import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { ReactElement } from "react";

export default function AdminLayout({ children }: { children: ReactElement }) {
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
