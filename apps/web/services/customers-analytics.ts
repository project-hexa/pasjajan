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

  const response = await api.get("/customers/analytics", {
    params,
  });

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

  const response = await serverApi.get("/customers/analytics", {
    params,
  });

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

  const response = await api.get("/customers", {
    params,
  });

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

  const response = await serverApi.get("/customers", {
    params,
  });

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
