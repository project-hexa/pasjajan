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
      growth: "+15%",
      value: "Rp45.230.000",
      description: "Strong week performance",
    },
    {
      title: "Total Units Sold",
      growth: "+12%",
      value: "345",
      description: "Above weekly average",
    },
    {
      title: "Avg. Order Value",
      growth: "+8%",
      value: "Rp131.188",
      description: "Improving daily",
    },
    {
      title: "Profit Margin",
      growth: "+3%",
      value: "28%",
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
      growth: "+18%",
      value: "Rp524.567.890",
      description: "Excellent quarter growth",
    },
    {
      title: "Total Units Sold",
      growth: "+14%",
      value: "3.892",
      description: "Strong quarter performance",
    },
    {
      title: "Avg. Order Value",
      growth: "+9%",
      value: "Rp134.789",
      description: "Consistent improvement",
    },
    {
      title: "Profit Margin",
      growth: "+4%",
      value: "27%",
      description: "Best quarterly margin",
    },
  ],
};

const chartDataByPeriod = {
  "7days": [
    { name: "Mon", value: 320 },
    { name: "Tue", value: 380 },
    { name: "Wed", value: 450 },
    { name: "Thu", value: 420 },
    { name: "Fri", value: 520 },
    { name: "Sat", value: 600 },
    { name: "Sun", value: 480 },
  ],
  "30days": [
    { name: "Week 1", value: 1200 },
    { name: "Week 2", value: 1450 },
    { name: "Week 3", value: 1650 },
    { name: "Week 4", value: 1800 },
  ],
  "3months": [
    { name: "Jan", value: 4500 },
    { name: "Feb", value: 5200 },
    { name: "Mar", value: 5800 },
  ],
};

const tableDataByPeriod = {
  "7days": [
    { name: "Indomie Goreng", unitSold: 45, revenue: "Rp450.000", sort: 1 },
    { name: "Mie Sedaap", unitSold: 38, revenue: "Rp380.000", sort: 2 },
    { name: "Pop Mie", unitSold: 32, revenue: "Rp320.000", sort: 3 },
    { name: "Sarimi", unitSold: 28, revenue: "Rp280.000", sort: 4 },
    { name: "Supermie", unitSold: 25, revenue: "Rp250.000", sort: 5 },
    { name: "Chitato", unitSold: 23, revenue: "Rp345.000", sort: 6 },
    { name: "Lays", unitSold: 19, revenue: "Rp285.000", sort: 7 },
    { name: "Taro", unitSold: 16, revenue: "Rp240.000", sort: 8 },
    { name: "Pocky", unitSold: 29, revenue: "Rp435.000", sort: 9 },
    { name: "Oreo", unitSold: 35, revenue: "Rp525.000", sort: 10 },
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
    { name: "Indomie Goreng", unitSold: 712, revenue: "Rp7.120.000", sort: 1 },
    { name: "Mie Sedaap", unitSold: 598, revenue: "Rp5.980.000", sort: 2 },
    { name: "Pop Mie", unitSold: 534, revenue: "Rp5.340.000", sort: 3 },
    { name: "Sarimi", unitSold: 445, revenue: "Rp4.450.000", sort: 4 },
    { name: "Supermie", unitSold: 398, revenue: "Rp3.980.000", sort: 5 },
    { name: "Chitato", unitSold: 367, revenue: "Rp5.505.000", sort: 6 },
    { name: "Lays", unitSold: 296, revenue: "Rp4.440.000", sort: 7 },
    { name: "Taro", unitSold: 263, revenue: "Rp3.945.000", sort: 8 },
    { name: "Pocky", unitSold: 472, revenue: "Rp7.080.000", sort: 9 },
    { name: "Oreo", unitSold: 571, revenue: "Rp8.565.000", sort: 10 },
    { name: "Roma Kelapa", unitSold: 433, revenue: "Rp4.330.000", sort: 11 },
    { name: "Biskuat", unitSold: 506, revenue: "Rp5.060.000", sort: 12 },
    { name: "Aqua 600ml", unitSold: 1345, revenue: "Rp4.035.000", sort: 13 },
    { name: "Le Minerale", unitSold: 945, revenue: "Rp2.835.000", sort: 14 },
    { name: "Coca Cola", unitSold: 708, revenue: "Rp5.664.000", sort: 15 },
    { name: "Teh Pucuk", unitSold: 902, revenue: "Rp4.510.000", sort: 16 },
    { name: "Kopi Kapal Api", unitSold: 564, revenue: "Rp2.820.000", sort: 17 },
    { name: "Ultra Milk", unitSold: 609, revenue: "Rp6.090.000", sort: 18 },
    { name: "SilverQueen", unitSold: 372, revenue: "Rp5.580.000", sort: 19 },
    { name: "Beng Beng", unitSold: 538, revenue: "Rp5.380.000", sort: 20 },
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
              variant={timeFilter === "3months" ? "default" : "outline"}
              onClick={() => setTimeFilter("3months")}
            >
              Last 3 Months
            </Button>
            <Button
              variant={timeFilter === "30days" ? "default" : "outline"}
              onClick={() => setTimeFilter("30days")}
            >
              Last 30 Days
            </Button>
            <Button
              variant={timeFilter === "7days" ? "default" : "outline"}
              onClick={() => setTimeFilter("7days")}
            >
              Last 7 Days
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
