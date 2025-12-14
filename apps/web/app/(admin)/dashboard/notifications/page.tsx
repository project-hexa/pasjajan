import NotificationsForm from "@/components/dashboard/notifications-form";
import NotificationsMetrics from "@/components/dashboard/notifications-metrics";
import NotificationsList from "@/components/dashboard/notifications-list";

export default function NotificationsPage() {
  return (
    <section className="w-full space-y-6">
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="col-span-2 row-span-2 space-y-6 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h3 className="text-2xl font-semibold">Buat Pesan Notifikasi</h3>
          <NotificationsForm />
        </div>
        <NotificationsMetrics />
      </div>
      <NotificationsList />
    </section>
  );
}
