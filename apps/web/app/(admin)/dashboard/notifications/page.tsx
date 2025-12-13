import AnalyticCard from "@/components/dashboard/analytic-card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Textarea } from "@workspace/ui/components/textarea";

export default function NotificationsPage() {
  return (
    <section className="w-full space-y-6">
      <div className="grid grid-cols-3 grid-rows-2 gap-4">
        <div className="col-span-2 row-span-2 space-y-6 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h3 className="text-2xl font-semibold">Buat Pesan Notifikasi</h3>
          <form action="" className="space-y-4">
            <label htmlFor="title">Judul</label>
            <Input name="title" id="title" />
            <label htmlFor="body">Isi Notifikasi</label>
            <Textarea name="body" id="body" rows={4} />
            <div className="flex justify-end">
              <Button type="submit" className="">
                Kirim Notifikasi
              </Button>
            </div>
          </form>
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
