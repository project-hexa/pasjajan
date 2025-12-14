import {
  ReportSalesResponse,
  reportSalesSchema,
} from "@/lib/schema/report-sales.schema";
import { getApiBaseUrl, getToken } from "@/lib/utils";

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
  const params = new URLSearchParams({ period });

  if (from) params.append("from", from);
  if (to) params.append("to", to);
  if (storeId) params.append("storeId", storeId);

  const url = `${getApiBaseUrl()}/api/reports/sales?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    console.error("Report sales fetch failed", { status: response.status, url });
    throw new Error("Gagal memuat data laporan penjualan.");
  }

  const data = await response.json();

  const parsedData = reportSalesSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Report Sales Schema Validation Error:", parsedData.error.flatten());
    throw new Error("Gagal memuat data laporan penjualan.");
  }

  return parsedData.data;
};
