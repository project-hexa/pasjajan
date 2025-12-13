import AnalyticCard from "@/components/dashboard/analytic-card";
import { AnalyticChart } from "@/components/dashboard/analytic-chart";
import ExportCsvButton from "@/components/dashboard/export-csv-button";
import { getReportSales } from "@/services/report-sales";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import Link from "next/link";

interface DashboardPageProps {
  searchParams: Promise<{
    period?: "monthly" | "yearly" | "daily" | "custom";
  }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;

  const period = params.period ?? "monthly";

  const { data } = await getReportSales({ period });

  return (
    <section className="space-y-4">
      <div className="flex gap-4">
        <AnalyticCard
          title="Total Pelanggan"
          value={data.summary.total_customers.value.toString()}
          growth={data.summary.total_customers.trend}
          description={data.summary.total_customers.description}
        />
        <AnalyticCard
          title="Total Transaksi"
          value={data.summary.total_transactions.value.toString()}
          growth={data.summary.total_transactions.trend}
          description={data.summary.total_transactions.description}
        />
        <AnalyticCard
          title="Rata-rata Transaksi"
          value={data.summary.avg_transaction.value.toString()}
          growth={data.summary.avg_transaction.trend}
          description={data.summary.avg_transaction.description}
        />
      </div>
      <div className="w-full space-y-8 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold">Periodic Sales Trend</h3>
          <div className="space-x-2">
            <Button
              asChild
              variant={period === "daily" ? "default" : "outline"}
            >
              <Link href="/dashboard?period=daily">Hari Ini</Link>
            </Button>
            <Button
              asChild
              variant={period === "monthly" ? "default" : "outline"}
            >
              <Link href="/dashboard?period=monthly">1 Bulan Terakhir</Link>
            </Button>
            <Button
              asChild
              variant={period === "yearly" ? "default" : "outline"}
            >
              <Link href="/dashboard?period=yearly">1 Tahun Terakhir</Link>
            </Button>
            <ExportCsvButton period={period} />
          </div>
        </div>
        <AnalyticChart
          label="Total"
          data={data.salesTrend.map((item) => ({
            name: item.date,
            value: item.value,
          }))}
        />
      </div>
      <div>
        <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
          <TableHeader>
            <TableRow className="bg-[#B9DCCC]">
              <TableHead className="pl-8">Name</TableHead>
              <TableHead>Unit Sold</TableHead>
              <TableHead className="pr-8">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.topProducts.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-8">{item.name}</TableCell>
                <TableCell>{item.unitSold}</TableCell>
                <TableCell className="pr-8">{item.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
