"use client";

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
import { useState } from "react";

type TimeFilter = "7days" | "30days" | "3months";

const analyticsDataByPeriod = {
  "7days": [
    {
      title: "Total Revenue",
      growth: "+8%",
      value: "Rp6.450.000",
      description: "Today's performance",
    },
    {
      title: "Total Units Sold",
      growth: "+5%",
      value: "48",
      description: "Good daily sales",
    },
    {
      title: "Avg. Order Value",
      growth: "+3%",
      value: "Rp134.375",
      description: "Steady today",
    },
    {
      title: "Profit Margin",
      growth: "+2%",
      value: "26%",
      description: "Healthy margins",
    },
  ],
  "30days": [
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
  ],
  "3months": [
    {
      title: "Total Revenue",
      growth: "+22%",
      value: "Rp2.145.678.900",
      description: "Excellent yearly growth",
    },
    {
      title: "Total Units Sold",
      growth: "+18%",
      value: "15.234",
      description: "Strong yearly performance",
    },
    {
      title: "Avg. Order Value",
      growth: "+12%",
      value: "Rp140.890",
      description: "Year-over-year improvement",
    },
    {
      title: "Profit Margin",
      growth: "+6%",
      value: "29%",
      description: "Best yearly margin",
    },
  ],
};

const chartDataByPeriod = {
  "7days": [
    { name: "00:00", value: 0 },
    { name: "04:00", value: 0 },
    { name: "08:00", value: 150 },
    { name: "12:00", value: 420 },
    { name: "16:00", value: 380 },
    { name: "20:00", value: 280 },
    { name: "23:59", value: 120 },
  ],
  "30days": [
    { name: "Week 1", value: 1200 },
    { name: "Week 2", value: 1450 },
    { name: "Week 3", value: 1650 },
    { name: "Week 4", value: 1800 },
  ],
  "3months": [
    { name: "Jan", value: 15200 },
    { name: "Feb", value: 16800 },
    { name: "Mar", value: 18400 },
    { name: "Apr", value: 17600 },
    { name: "May", value: 19200 },
    { name: "Jun", value: 20100 },
    { name: "Jul", value: 21500 },
    { name: "Aug", value: 19800 },
    { name: "Sep", value: 22400 },
    { name: "Oct", value: 23600 },
    { name: "Nov", value: 24800 },
    { name: "Dec", value: 26200 },
  ],
};

const tableDataByPeriod = {
  "7days": [
    { name: "Indomie Goreng", unitSold: 8, revenue: "Rp80.000", sort: 1 },
    { name: "Aqua 600ml", unitSold: 12, revenue: "Rp36.000", sort: 2 },
    { name: "Teh Pucuk", unitSold: 7, revenue: "Rp35.000", sort: 3 },
    { name: "Oreo", unitSold: 5, revenue: "Rp75.000", sort: 4 },
    { name: "Coca Cola", unitSold: 6, revenue: "Rp48.000", sort: 5 },
    { name: "Mie Sedaap", unitSold: 4, revenue: "Rp40.000", sort: 6 },
    { name: "Chitato", unitSold: 3, revenue: "Rp45.000", sort: 7 },
    { name: "Pocky", unitSold: 3, revenue: "Rp45.000", sort: 8 },
  ],
  "30days": [
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
  ],
  "3months": [
    {
      name: "Indomie Goreng",
      unitSold: 2856,
      revenue: "Rp28.560.000",
      sort: 1,
    },
    { name: "Aqua 600ml", unitSold: 5380, revenue: "Rp16.140.000", sort: 2 },
    { name: "Teh Pucuk", unitSold: 3612, revenue: "Rp18.060.000", sort: 3 },
    { name: "Mie Sedaap", unitSold: 2392, revenue: "Rp23.920.000", sort: 4 },
    { name: "Oreo", unitSold: 2284, revenue: "Rp34.260.000", sort: 5 },
    { name: "Coca Cola", unitSold: 2832, revenue: "Rp22.656.000", sort: 6 },
    { name: "Pop Mie", unitSold: 2136, revenue: "Rp21.360.000", sort: 7 },
    { name: "Chitato", unitSold: 1468, revenue: "Rp22.020.000", sort: 8 },
    { name: "Pocky", unitSold: 1888, revenue: "Rp28.320.000", sort: 9 },
    { name: "Ultra Milk", unitSold: 2436, revenue: "Rp24.360.000", sort: 10 },
    { name: "Sarimi", unitSold: 1780, revenue: "Rp17.800.000", sort: 11 },
    { name: "Biskuat", unitSold: 2024, revenue: "Rp20.240.000", sort: 12 },
    { name: "Le Minerale", unitSold: 3780, revenue: "Rp11.340.000", sort: 13 },
    { name: "Supermie", unitSold: 1592, revenue: "Rp15.920.000", sort: 14 },
    { name: "Roma Kelapa", unitSold: 1732, revenue: "Rp17.320.000", sort: 15 },
    { name: "Lays", unitSold: 1184, revenue: "Rp17.760.000", sort: 16 },
    {
      name: "Kopi Kapal Api",
      unitSold: 2256,
      revenue: "Rp11.280.000",
      sort: 17,
    },
    { name: "SilverQueen", unitSold: 1488, revenue: "Rp22.320.000", sort: 18 },
    { name: "Beng Beng", unitSold: 2152, revenue: "Rp21.520.000", sort: 19 },
    { name: "Taro", unitSold: 1052, revenue: "Rp15.780.000", sort: 20 },
  ],
};

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
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("30days");

  const analyticsData = analyticsDataByPeriod[timeFilter];
  const chartData = chartDataByPeriod[timeFilter];
  const tableData = tableDataByPeriod[timeFilter];

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
            <Button
              variant={timeFilter === "7days" ? "default" : "outline"}
              onClick={() => setTimeFilter("7days")}
            >
              Hari Ini
            </Button>
            <Button
              variant={timeFilter === "30days" ? "default" : "outline"}
              onClick={() => setTimeFilter("30days")}
            >
              1 Bulan Terakhir
            </Button>
            <Button
              variant={timeFilter === "3months" ? "default" : "outline"}
              onClick={() => setTimeFilter("3months")}
            >
              1 Tahun Terakhir
            </Button>
            <Button className="ml-16">Export CSV</Button>
          </div>
        </div>
        <AnalyticChart label="Total" data={chartData} />
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
