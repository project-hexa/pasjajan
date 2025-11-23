"use client";

import AnalyticCard from "@/components/dashboard/analytic-card";
import { AnalyticChart } from "@/components/dashboard/analytic-chart";
import AnalyticPieChart from "@/components/dashboard/analytic-pie-chart";
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
import { SearchIcon } from "lucide-react";

const analyticsData = [
  {
    title: "Total Pelanggan",
    growth: "+12%",
    value: "Rp177.841.124",
    description: "Trending up this month",
  },
  {
    title: "Total Transaksi",
    growth: "+8%",
    value: "1.234",
    description: "Trending up this month",
  },
  {
    title: "Rata-Rata Transaksi",
    growth: "+5%",
    value: "Rp143.567",
    description: "Stable compared to last month",
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

const pieChartData = [
  { name: "Indomie", value: 275, fill: "var(--color-chrome)" },
  { name: "Supermi", value: 200, fill: "var(--color-safari)" },
  { name: "Nuvo", value: 187, fill: "var(--color-firefox)" },
];

const pieChartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Firefox",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Edge",
    color: "var(--chart-4)",
  },
  other: {
    label: "Other",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const tableData = [
  {
    id: 1,
    customerName: "Ahmad Wijaya",
    email: "ahmad.wijaya@example.com",
    product: "Indomie Goreng",
    qty: 5,
    totalPrice: "Rp125.000",
  },
  {
    id: 2,
    customerName: "Siti Nurhaliza",
    email: "siti.nur@example.com",
    product: "Supermi Ayam Bawang",
    qty: 4,
    totalPrice: "Rp98.000",
  },
  {
    id: 3,
    customerName: "Budi Santoso",
    email: "budi.santoso@example.com",
    product: "Nuvo Instant Noodle",
    qty: 6,
    totalPrice: "Rp156.000",
  },
  {
    id: 4,
    customerName: "Dewi Lestari",
    email: "dewi.lestari@example.com",
    product: "Indomie Soto",
    qty: 3,
    totalPrice: "Rp87.500",
  },
  {
    id: 5,
    customerName: "Eko Prasetyo",
    email: "eko.prasetyo@example.com",
    product: "Supermi Kari Ayam",
    qty: 5,
    totalPrice: "Rp143.000",
  },
  {
    id: 6,
    customerName: "Fitri Handayani",
    email: "fitri.handayani@example.com",
    product: "Indomie Rendang",
    qty: 8,
    totalPrice: "Rp234.000",
  },
  {
    id: 7,
    customerName: "Gunawan Setiawan",
    email: "gunawan.s@example.com",
    product: "Nuvo Spicy",
    qty: 7,
    totalPrice: "Rp176.500",
  },
  {
    id: 8,
    customerName: "Hana Permata",
    email: "hana.permata@example.com",
    product: "Indomie Goreng Spesial",
    qty: 6,
    totalPrice: "Rp198.000",
  },
  {
    id: 9,
    customerName: "Indra Kusuma",
    email: "indra.kusuma@example.com",
    product: "Supermi Baso Sapi",
    qty: 4,
    totalPrice: "Rp112.000",
  },
  {
    id: 10,
    customerName: "Julia Rahmawati",
    email: "julia.r@example.com",
    product: "Nuvo Original",
    qty: 5,
    totalPrice: "Rp165.000",
  },
  {
    id: 11,
    customerName: "Kartika Sari",
    email: "kartika.sari@example.com",
    product: "Indomie Ayam Bawang",
    qty: 7,
    totalPrice: "Rp189.000",
  },
  {
    id: 12,
    customerName: "Lukman Hakim",
    email: "lukman.hakim@example.com",
    product: "Supermi Goreng",
    qty: 5,
    totalPrice: "Rp134.500",
  },
  {
    id: 13,
    customerName: "Maya Putri",
    email: "maya.putri@example.com",
    product: "Nuvo Barbeque",
    qty: 8,
    totalPrice: "Rp201.000",
  },
  {
    id: 14,
    customerName: "Nanda Wijayanto",
    email: "nanda.w@example.com",
    product: "Indomie Kari Ayam",
    qty: 6,
    totalPrice: "Rp156.500",
  },
  {
    id: 15,
    customerName: "Olivia Tan",
    email: "olivia.tan@example.com",
    product: "Supermi Soto",
    qty: 3,
    totalPrice: "Rp92.000",
  },
  {
    id: 16,
    customerName: "Putra Mahendra",
    email: "putra.m@example.com",
    product: "Indomie Goreng Jumbo",
    qty: 9,
    totalPrice: "Rp267.000",
  },
  {
    id: 17,
    customerName: "Qori Amalia",
    email: "qori.amalia@example.com",
    product: "Nuvo Cheese",
    qty: 7,
    totalPrice: "Rp178.500",
  },
  {
    id: 18,
    customerName: "Rizky Fauzan",
    email: "rizky.fauzan@example.com",
    product: "Supermi Ayam Spesial",
    qty: 5,
    totalPrice: "Rp145.000",
  },
  {
    id: 19,
    customerName: "Sarah Amelia",
    email: "sarah.amelia@example.com",
    product: "Indomie Soto Padang",
    qty: 8,
    totalPrice: "Rp213.000",
  },
  {
    id: 20,
    customerName: "Teguh Santoso",
    email: "teguh.santoso@example.com",
    product: "Nuvo Hot & Spicy",
    qty: 6,
    totalPrice: "Rp187.500",
  },
];

export default function CustomersAnalytics() {
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
      <div className="flex gap-4">
        <div className="w-full space-y-8 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl">
          <h3 className="text-2xl font-semibold">Tren Penjualan</h3>
          <AnalyticChart label="Yahut" data={chartData} className="h-48" />
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
      <div>
        <Table className="overflow-clip rounded-2xl bg-[#F7FFFB]">
          <TableHeader>
            <TableRow className="bg-[#B9DCCC]">
              <TableHead className="pl-8">Nama Pelanggan</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="pr-8">Total Harga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="pl-8">{item.customerName}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>{item.product}</TableCell>
                <TableCell>{item.qty}</TableCell>
                <TableCell className="pr-8">{item.totalPrice}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
