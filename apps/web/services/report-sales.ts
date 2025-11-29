import {
  ReportSalesResponse,
  reportSalesSchema,
} from "@/lib/schema/report-sales.schema";
import { getToken } from "@/lib/utils";

interface ReportSalesParams {
  period: "monthly" | "yearly" | "daily" | "custom";
  from?: "string";
  to?: "string";
  storeId?: "string";
}

export const getReportSales = async ({
  period,
  from,
  to,
  storeId,
}: ReportSalesParams): Promise<ReportSalesResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reports/sales?period=${period}${from ? `&from=${from}` : ""}${to ? `&to=${to}` : ""}${storeId ? `&storeId=${storeId}` : ""}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal memuat data laporan penjualan.");
  }

  const data = await response.json();

  const parsedData = reportSalesSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Report Sales Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data laporan penjualan.");
  }

  return parsedData.data;
};
