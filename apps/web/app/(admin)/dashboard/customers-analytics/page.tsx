import AnalyticCard from "@/components/dashboard/analytic-card";
import { AnalyticChart } from "@/components/dashboard/analytic-chart";
import AnalyticPieChart from "@/components/dashboard/analytic-pie-chart";
import CustomerAnalyticsClient from "@/components/dashboard/customer-analytics-client";
import {
  getCustomerList,
  getCustomersAnalytics,
} from "@/services/customers-analytics";

import { ChartConfig } from "@workspace/ui/components/chart";

interface CustomerPageProps {
  searchParams: Promise<{
    period?: "monthly" | "yearly" | "daily" | "custom";
    search?: string;
    page?: string;
    start_date?: string;
    end_date?: string;
  }>;
}

export default async function CustomersAnalytics({
  searchParams,
}: CustomerPageProps) {
  const { period, search, page, start_date, end_date } = await searchParams;

  const currentPeriod = period ?? "monthly";
  const currentPage = parseInt(page ?? "1", 10);

  const { data } = await getCustomersAnalytics({
    period: currentPeriod,
    start_date,
    end_date,
  });

  const { data: customerList } = await getCustomerList({
    page: currentPage,
    perPage: 20,
    period: currentPeriod,
    sort: "highest",
    search,
    start_date,
    end_date,
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
              name: item.date,
              value: item.value,
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
      <CustomerAnalyticsClient initialData={customerList} />
    </section>
  );
}