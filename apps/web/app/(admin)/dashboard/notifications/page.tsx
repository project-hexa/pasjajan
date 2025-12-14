import AnalyticCard from "@/components/dashboard/analytic-card";
import NotificationsForm from "@/components/dashboard/notifications-form";

export default function NotificationsPage() {
  return (
    <section className="w-full space-y-6">
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="col-span-2 row-span-2 space-y-6 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h3 className="text-2xl font-semibold">Buat Pesan Notifikasi</h3>
          <NotificationsForm />
        </div>
        <AnalyticCard
          title="Pengguna Aktif"
          value="12345"
          growth="+12%"
          description="oke"
          className="w-full"
        />
        <AnalyticCard
          title="Pengguna Aktif"
          value="12345"
          growth="+12%"
          description="oke"
          className="w-full"
        />
      </div>
      <ul className="space-y-4">
        <li className="rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h4 className="font-semibold">Promo akhir tahun</h4>
          <p>Ini deskripsi</p>
        </li>
        <li className="rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h4 className="font-semibold">Promo akhir tahun</h4>
          <p>Ini deskripsi</p>
        </li>
      </ul>
    </section>
  );
}
