import {
  ReportSalesResponse,
  reportSalesSchema,
} from "@/lib/schema/report-sales.schema";
import { api, createServerAPI } from "@/lib/utils/axios";

interface ReportSalesParams {
  period: "monthly" | "yearly" | "daily" | "custom";
  from?: "string";
  to?: "string";
  storeId?: "string";
}

// Client-side version
export const getReportSales = async ({
  period,
  from,
  to,
  storeId,
}: ReportSalesParams): Promise<ReportSalesResponse> => {
  const params: Record<string, string> = { period };

  if (from) params.from = from;
  if (to) params.to = to;
  if (storeId) params.storeId = storeId;

  const response = await api.get("/reports/sales", {
    params,
  });

  console.log(response);

  const parsedData = reportSalesSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Report Sales Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data laporan penjualan.");
  }

  return parsedData.data;
};

// Server-side version for Server Components
export const getReportSalesServer = async ({
  period,
  from,
  to,
  storeId,
}: ReportSalesParams): Promise<ReportSalesResponse> => {
  const serverApi = await createServerAPI();
  const params: Record<string, string> = { period };

  if (from) params.from = from;
  if (to) params.to = to;
  if (storeId) params.storeId = storeId;

  const response = await serverApi.get("/reports/sales", {
    params,
  });

  console.log(response);

  const parsedData = reportSalesSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Report Sales Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data laporan penjualan.");
  }

  return parsedData.data;
};

interface ExportReportSalesParams {
  period: "monthly" | "yearly" | "daily" | "custom";
  from?: "string";
  to?: "string";
  storeId?: "string";
}

export const exportReportSales = async ({
  period,
  from,
  to,
  storeId,
}: ExportReportSalesParams) => {
  const params: Record<string, string> = { period };

  if (from) params.from = from;
  if (to) params.to = to;
  if (storeId) params.storeId = storeId;

  const response = await api.get("/sales/export", {
    params,
    responseType: "blob",
  });

  const blob = response.data;
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `report_sales_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
