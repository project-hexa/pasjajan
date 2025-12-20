"use client";

import AnalyticCard from "@/app/(modul 6 - dashboard)/_components/analytic-card";
import { AnalyticChart } from "@/app/(modul 6 - dashboard)/_components/analytic-chart";
import ExportCsvButton from "@/app/(modul 6 - dashboard)/_components/export-csv-button";
import { getReportSales } from "@/services/report-sales"; // Use Client Service
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
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ReportSalesResponse } from "@/lib/schema/report-sales.schema";

import { Suspense } from "react";

function DashboardContent() {
  const searchParams = useSearchParams();
  const period = (searchParams.get("period") as "monthly" | "daily" | "yearly" | "custom") ?? "monthly";
  const [data, setData] = useState<ReportSalesResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getReportSales({ period });
        setData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  if (loading || !data) {
    return <div className="p-8 text-center">Loading Dashboard...</div>;
  }

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
            name: item.label.toString(),
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

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
