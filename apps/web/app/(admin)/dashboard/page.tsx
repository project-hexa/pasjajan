import AnalyticCard from "@/components/dashboard/analytic-card";
import { AnalyticChart } from "@/components/dashboard/analytic-chart";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";

const analyticsData = [
  {
    title: "Total Revenue",
    growth: "+12%",
    value: "Rp177.841.124",
    description: "Trending up this month",
  },
  {
    title: "Total Units Sold",
    growth: "+8%",
    value: "1.234",
    description: "Trending up this month",
  },
  {
    title: "Avg. Order Value",
    growth: "+5%",
    value: "Rp143.567",
    description: "Stable compared to last month",
  },
  {
    title: "Profit Margin",
    growth: "-2%",
    value: "25%",
    description: "Slight decrease this month",
  },
];

const chartData = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 200 },
  { name: "May", value: 400 },
  { name: "Jun", value: 350 },
];

const tableData = [
  { name: "Indomie Goreng", unitSold: 234, revenue: "Rp2.340.000", sort: 1 },
  { name: "Mie Sedaap", unitSold: 198, revenue: "Rp1.980.000", sort: 2 },
  { name: "Pop Mie", unitSold: 176, revenue: "Rp1.760.000", sort: 3 },
  { name: "Sarimi", unitSold: 145, revenue: "Rp1.450.000", sort: 4 },
  { name: "Supermie", unitSold: 132, revenue: "Rp1.320.000", sort: 5 },
  { name: "Chitato", unitSold: 121, revenue: "Rp1.815.000", sort: 6 },
  { name: "Lays", unitSold: 98, revenue: "Rp1.470.000", sort: 7 },
  { name: "Taro", unitSold: 87, revenue: "Rp1.305.000", sort: 8 },
  { name: "Pocky", unitSold: 156, revenue: "Rp2.340.000", sort: 9 },
  { name: "Oreo", unitSold: 189, revenue: "Rp2.835.000", sort: 10 },
  { name: "Roma Kelapa", unitSold: 143, revenue: "Rp1.430.000", sort: 11 },
  { name: "Biskuat", unitSold: 167, revenue: "Rp1.670.000", sort: 12 },
  { name: "Aqua 600ml", unitSold: 445, revenue: "Rp1.335.000", sort: 13 },
  { name: "Le Minerale", unitSold: 312, revenue: "Rp936.000", sort: 14 },
  { name: "Coca Cola", unitSold: 234, revenue: "Rp1.872.000", sort: 15 },
  { name: "Teh Pucuk", unitSold: 298, revenue: "Rp1.490.000", sort: 16 },
  { name: "Kopi Kapal Api", unitSold: 187, revenue: "Rp935.000", sort: 17 },
  { name: "Ultra Milk", unitSold: 201, revenue: "Rp2.010.000", sort: 18 },
  { name: "SilverQueen", unitSold: 123, revenue: "Rp1.845.000", sort: 19 },
  { name: "Beng Beng", unitSold: 178, revenue: "Rp1.780.000", sort: 20 },
];

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <div className="flex gap-4">
        {analyticsData.map((data) => (
          <AnalyticCard
            key={data.title}
            title={data.title}
            growth={data.growth}
            value={data.value}
            description={data.description}
          />
        ))}
      </div>
      <div className="w-full space-y-8 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
        <div className="flex justify-between">
          <h3 className="text-2xl font-semibold">Periodic Sales Trend</h3>
          <div className="space-x-2">
            <Button variant="outline">Last 3 Months</Button>
            <Button variant="outline">Last 30 Days</Button>
            <Button variant="outline">Last 7 Days</Button>
          </div>
        </div>
        <AnalyticChart label="Yahut" data={chartData} />
      </div>
      <div>
        <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
          <TableHeader>
            <TableRow className="bg-[#B9DCCC]">
              <TableHead className="pl-8">Name</TableHead>
              <TableHead>Unit Sold</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead className="pr-8">Sort</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.sort}>
                <TableCell className="pl-8">{item.name}</TableCell>
                <TableCell>{item.unitSold}</TableCell>
                <TableCell>{item.revenue}</TableCell>
                <TableCell className="pr-8">{item.sort}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
