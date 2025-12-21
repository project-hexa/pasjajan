import {
  CustomerAnalyticResponse,
  customerAnalyticSchema,
  customerListSchema,
} from "@/lib/schema/customers-analytics.schema";
import { api, createServerApi } from "@/lib/utils/axios";

interface CustomerAnalyticParams {
  period: "monthly" | "yearly" | "daily" | "custom";
  start_date?: string;
  end_date?: string;
}

interface CustomerListParams {
  perPage: number;
  page: number;
  period: "monthly" | "yearly" | "daily" | "custom";
  sort: "highest" | "lowest";
  search?: string;
  start_date?: string;
  end_date?: string;
}

export const getCustomersAnalytics = async ({
  period,
  start_date,
  end_date,
}: CustomerAnalyticParams): Promise<CustomerAnalyticResponse> => {
  const params: Record<string, string> = { period };

  if (period === "custom" && start_date && end_date) {
    params.from = start_date;
    params.to = end_date;
  }

  // Override with Mock Data (Client Side)
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock Client)",
      data: {
        period: {
          filter: period,
          from: start_date || new Date().toISOString(),
          to: end_date || new Date().toISOString()
        },
        summary: {
          total_customers: {
            value: 1250,
            trend: "up",
            description: "+15% vs last period"
          },
          total_transactions: {
            value: "Rp 150.000.000",
            trend: "up",
            description: "+10% vs last period"
          },
          avg_transaction: {
            value: "Rp 120.000",
            trend: "down",
            description: "-2% vs last period"
          }
        },
        analytics: {
          purchase_trend: Array.from({ length: 12 }, (_, i) => ({
            label: i + 1,
            date: `2025-${(i + 1).toString().padStart(2, '0')}-01`,
            value: Math.floor(Math.random() * 100),
            revenue: (Math.floor(Math.random() * 10000000)).toString()
          })),
          category_composition: [
            { category: "Makanan", quantity: 500, percentage: 50 },
            { category: "Minuman", quantity: 300, percentage: 30 },
            { category: "Lainnya", quantity: 200, percentage: 20 }
          ],
          purchase_frequency: []
        }
      }
    }
  };

  await new Promise(resolve => setTimeout(resolve, 300));
  const response = mockResponse;
  /*
  const response = await api.get("/customers/analytics", {
    params,
  });
  */

  console.log(response);

  const parsedData = customerAnalyticSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error(
      "Customer Analytic Schema Validation Error:",
      parsedData.error,
    );
    throw new Error("Gagal memuat data analitik pelanggan.");
  }

  return parsedData.data;
};

// Server-side version for Server Components
export const getCustomersAnalyticsServer = async ({
  period,
  start_date,
  end_date,
}: CustomerAnalyticParams): Promise<CustomerAnalyticResponse> => {
  const serverApi = await createServerApi();
  const params: Record<string, string> = { period };

  if (period === "custom" && start_date && end_date) {
    params.from = start_date;
    params.to = end_date;
  }

  // Override with Mock Data to avoid 403 error
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock)",
      data: {
        period: {
          filter: period,
          from: start_date || new Date().toISOString(),
          to: end_date || new Date().toISOString()
        },
        summary: {
          total_customers: {
            value: 1250,
            trend: "up",
            description: "+15% vs last period"
          },
          total_transactions: {
            value: "Rp 150.000.000",
            trend: "up",
            description: "+10% vs last period"
          },
          avg_transaction: {
            value: "Rp 120.000",
            trend: "down",
            description: "-2% vs last period"
          }
        },
        analytics: {
          purchase_trend: Array.from({ length: 12 }, (_, i) => ({
            label: i + 1,
            date: `2025-${(i + 1).toString().padStart(2, '0')}-01`,
            value: Math.floor(Math.random() * 100),
            revenue: (Math.floor(Math.random() * 10000000)).toString()
          })),
          category_composition: [
            { category: "Makanan", quantity: 500, percentage: 50 },
            { category: "Minuman", quantity: 300, percentage: 30 },
            { category: "Lainnya", quantity: 200, percentage: 20 }
          ],
          purchase_frequency: []
        }
      }
    }
  };

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const response = mockResponse;
  /*
  const response = await serverApi.get("/customers/analytics", {
    params,
  });
  */

  console.log(response);

  const parsedData = customerAnalyticSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error(
      "Customer Analytic Schema Validation Error:",
      parsedData.error,
    );
    throw new Error("Gagal memuat data analitik pelanggan.");
  }

  return parsedData.data;
};

export const getCustomerList = async ({
  page,
  perPage,
  period,
  sort,
  search,
  start_date,
  end_date,
}: CustomerListParams) => {
  const params: Record<string, string> = {
    sort,
    period,
    page: page.toString(),
    per_page: perPage.toString(),
  };

  if (search) {
    params.search = search;
  }

  if (period === "custom" && start_date && end_date) {
    params.from = start_date;
    params.to = end_date;
  }

  // Override with Mock Data (Client Side)
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock Client)",
      data: {
        customers: [
          {
            customer_name: "Budi Santoso",
            transaction_date: new Date().toISOString(),
            total_items: 5,
            total_payment: "Rp 250.000"
          },
          {
            customer_name: "Siti Aminah",
            transaction_date: new Date(Date.now() - 86400000).toISOString(),
            total_items: 3,
            total_payment: "Rp 150.000"
          },
          {
            customer_name: "Rudi Hartono",
            transaction_date: new Date(Date.now() - 172800000).toISOString(),
            total_items: 10,
            total_payment: "Rp 1.250.000"
          },
          {
            customer_name: "Dewi Lestari",
            transaction_date: new Date(Date.now() - 259200000).toISOString(),
            total_items: 2,
            total_payment: "Rp 75.000"
          },
          {
            customer_name: "Agus Setiawan",
            transaction_date: new Date(Date.now() - 345600000).toISOString(),
            total_items: 8,
            total_payment: "Rp 800.000"
          }
        ],
        pagination: {
          current_page: page,
          per_page: perPage,
          total: 50,
          last_page: 5,
          from: (page - 1) * perPage + 1,
          to: page * perPage
        }
      }
    }
  };

  await new Promise(resolve => setTimeout(resolve, 300));
  const response = mockResponse;
  /*
  const response = await api.get("/customers", {
    params,
  });
  */

  const parsedData = customerListSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Customer List Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data daftar pelanggan.");
  }

  return parsedData.data;
};

// Server-side version for Server Components
export const getCustomerListServer = async ({
  page,
  perPage,
  period,
  sort,
  search,
  start_date,
  end_date,
}: CustomerListParams) => {
  const serverApi = await createServerApi();
  const params: Record<string, string> = {
    sort,
    period,
    page: page.toString(),
    per_page: perPage.toString(),
  };

  if (search) {
    params.search = search;
  }

  if (period === "custom" && start_date && end_date) {
    params.from = start_date;
    params.to = end_date;
  }

  // Override with Mock Data to avoid 403 error
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock)",
      data: {
        customers: [
          {
            customer_name: "Budi Santoso",
            transaction_date: new Date().toISOString(),
            total_items: 5,
            total_payment: "Rp 250.000"
          },
          {
            customer_name: "Siti Aminah",
            transaction_date: new Date(Date.now() - 86400000).toISOString(),
            total_items: 3,
            total_payment: "Rp 150.000"
          },
          {
            customer_name: "Rudi Hartono",
            transaction_date: new Date(Date.now() - 172800000).toISOString(),
            total_items: 10,
            total_payment: "Rp 1.250.000"
          },
          {
            customer_name: "Dewi Lestari",
            transaction_date: new Date(Date.now() - 259200000).toISOString(),
            total_items: 2,
            total_payment: "Rp 75.000"
          },
          {
            customer_name: "Agus Setiawan",
            transaction_date: new Date(Date.now() - 345600000).toISOString(),
            total_items: 8,
            total_payment: "Rp 800.000"
          }
        ],
        pagination: {
          current_page: page,
          per_page: perPage,
          total: 50,
          last_page: 5,
          from: (page - 1) * perPage + 1,
          to: page * perPage
        }
      }
    }
  };

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const response = mockResponse;
  /*
  const response = await serverApi.get("/customers", {
    params,
  });
  */

  const parsedData = customerListSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Customer List Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data daftar pelanggan.");
  }

  return parsedData.data;
};

export const exportCustomerReport = async (name: string | undefined) => {
  const params = name ? { search: name } : {};

  const response = await api.get("/customers/export", {
    params,
    responseType: "blob",
  });

  const blob = response.data;
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `report_customers_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
