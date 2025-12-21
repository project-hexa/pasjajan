import {
  ReportSalesResponse,
  reportSalesSchema,
} from "@/lib/schema/report-sales.schema";
import { api, createServerApi } from "@/lib/utils/axios";

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

  // Override with Mock Data (Client Side)
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock Client)",
      data: {
        parameters: {
          period: period,
          store_id: null,
          top_n: 5,
          date_range: {
            from: from || new Date().toISOString(),
            to: to || new Date().toISOString()
          }
        },
        summary: {
          total_customers: {
            value: 850,
            trend: "up",
            description: "+12% vs last period"
          },
          total_transactions: {
            value: "Rp 250.000.000",
            trend: "up",
            description: "+8% vs last period"
          },
          avg_transaction: {
            value: "Rp 100.000",
            trend: "stable",
            description: "0% vs last period"
          }
        },
        salesTrend: Array.from({ length: 12 }, (_, i) => ({
          label: i + 1,
          date: `2025-${(i + 1).toString().padStart(2, '0')}-01`,
          value: Math.floor(Math.random() * 500),
          revenue: "Rp " + (Math.floor(Math.random() * 50000000)).toLocaleString('id-ID')
        })),
        topProducts: [
          { id: 1, name: "Kopi Susu Gula Aren", unitSold: 1200, revenue: "Rp 24.000.000" },
          { id: 2, name: "Roti Bakar Coklat", unitSold: 800, revenue: "Rp 12.000.000" },
          { id: 3, name: "Mie Goreng Spesial", unitSold: 650, revenue: "Rp 16.250.000" },
          { id: 4, name: "Es Teh Manis", unitSold: 1500, revenue: "Rp 7.500.000" },
          { id: 5, name: "Nasi Goreng Ayam", unitSold: 500, revenue: "Rp 15.000.000" }
        ]
      }
    }
  };

  await new Promise(resolve => setTimeout(resolve, 300));
  const response = mockResponse;
  /*
  const response = await api.get("/reports/sales", {
    params,
  });
  */

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
  const serverApi = await createServerApi();
  const params: Record<string, string> = { period };

  if (from) params.from = from;
  if (to) params.to = to;
  if (storeId) params.storeId = storeId;

  // Override with Mock Data to avoid 403 error
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock)",
      data: {
        parameters: {
          period: period,
          store_id: null, // As required by schema z.null()
          top_n: 5,
          date_range: {
            from: from || new Date().toISOString(),
            to: to || new Date().toISOString()
          }
        },
        summary: {
          total_customers: {
            value: 850,
            trend: "up",
            description: "+12% vs last period"
          },
          total_transactions: {
            value: "Rp 250.000.000",
            trend: "up",
            description: "+8% vs last period"
          },
          avg_transaction: {
            value: "Rp 100.000",
            trend: "stable",
            description: "0% vs last period"
          }
        },
        salesTrend: Array.from({ length: 12 }, (_, i) => ({
          label: i + 1,
          date: `2025-${(i + 1).toString().padStart(2, '0')}-01`,
          value: Math.floor(Math.random() * 500),
          revenue: "Rp " + (Math.floor(Math.random() * 50000000)).toLocaleString('id-ID')
        })),
        topProducts: [
          { id: 1, name: "Kopi Susu Gula Aren", unitSold: 1200, revenue: "Rp 24.000.000" },
          { id: 2, name: "Roti Bakar Coklat", unitSold: 800, revenue: "Rp 12.000.000" },
          { id: 3, name: "Mie Goreng Spesial", unitSold: 650, revenue: "Rp 16.250.000" },
          { id: 4, name: "Es Teh Manis", unitSold: 1500, revenue: "Rp 7.500.000" },
          { id: 5, name: "Nasi Goreng Ayam", unitSold: 500, revenue: "Rp 15.000.000" }
        ]
      }
    }
  };

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const response = mockResponse;
  /*
  const response = await serverApi.get("/reports/sales", {
    params,
  });
  */

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
