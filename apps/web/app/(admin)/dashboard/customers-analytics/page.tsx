import AnalyticCard from "@/components/dashboard/analytic-card";
import { AnalyticChart } from "@/components/dashboard/analytic-chart";
import AnalyticPieChart from "@/components/dashboard/analytic-pie-chart";
import {
  getCustomerList,
  getCustomersAnalytics,
} from "@/services/customers-analytics";

import { Button } from "@workspace/ui/components/button";
import { ChartConfig } from "@workspace/ui/components/chart";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { SearchIcon } from "lucide-react";

interface CustomerPageProps {
  searchParams: Promise<{
    period?: "monthly" | "yearly" | "daily" | "custom";
    search?: string;
  }>;
}

export default async function CustomersAnalytics({
  searchParams,
}: CustomerPageProps) {
  const { period, search } = await searchParams;

  const { data } = await getCustomersAnalytics({ period: "30h" });

  const { data: customerList } = await getCustomerList({
    page: 1,
    perPage: 20,
    period: "30h",
    sort: "highest",
  });

  const chartColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
    "var(--chart-8)",
  ];

  const pieChartConfig = data.analytics.category_composition.reduce(
    (config, item, index) => {
      const key = item.category.toLowerCase().replace(/\s+/g, "_");
      config[key] = {
        label: item.category,
        color: chartColors[index % chartColors.length],
      };
      return config;
    },
    { value: { label: "Persentase" } } as ChartConfig,
  );

  const pieChartData = data.analytics.category_composition.map(
    (item, index) => ({
      name: item.category,
      value: item.percentage,
      fill: chartColors[index % chartColors.length],
    }),
  );

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
      <div className="flex gap-4">
        <div className="w-full space-y-8 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h3 className="text-2xl font-semibold">Tren Penjualan</h3>
          <AnalyticChart
            label="Yahut"
            data={data.analytics.purchase_trend.map((item) => ({
              name: item.label,
              value: item.transactions,
            }))}
            className="h-48"
          />
        </div>
        <div className="space-y-8 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h3 className="text-2xl font-semibold text-nowrap">
            Penjualan Per-Kategori
          </h3>
          <AnalyticPieChart
            data={pieChartData}
            config={pieChartConfig}
            className="h-48"
          />
        </div>
      </div>
      <div className="flex items-center justify-between rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
        <div className="flex items-center">
          <SearchIcon />
          <Input
            placeholder="Search"
            className="border-0 shadow-none focus-visible:ring-0"
            name="search"
          />
        </div>
        <div className="space-x-2">
          <Button variant="outline">Last 3 Months</Button>
          <Button variant="outline">Last 30 Days</Button>
          <Button variant="outline">Last 7 Days</Button>
          <Button className="ml-16">Export CSV</Button>
        </div>
      </div>
      <div className="space-y-4">
        <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
          <TableHeader>
            <TableRow className="bg-[#B9DCCC]">
              <TableHead className="pl-8">Nama Pelanggan</TableHead>
              <TableHead>Tanggal Transaksi</TableHead>
              <TableHead>Total Item</TableHead>
              <TableHead className="pr-8">Total Harga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerList.customers.map((item, i) => (
              <TableRow key={`customer-list-${i}`}>
                <TableCell className="pl-8">{item.customer_name}</TableCell>
                <TableCell>{item.transaction_date}</TableCell>
                <TableCell>{item.total_items}</TableCell>
                <TableCell className="pr-8">{item.total_payment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
}
