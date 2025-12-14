import {
  CustomerAnalyticResponse,
  customerAnalyticSchema,
  customerListSchema,
} from "@/lib/schema/customers-analytics.schema";
import { getToken } from "@/lib/utils";

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
  const params = new URLSearchParams({ period });

  if (period === "custom" && start_date && end_date) {
    params.append("from", start_date);
    params.append("to", end_date);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers/analytics?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Gagal memuat data analitik pelanggan.");
  }

  const data = await response.json();

  const parsedData = customerAnalyticSchema.safeParse(data);

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
  const params = new URLSearchParams({
    sort,
    period,
    page: page.toString(),
    per_page: perPage.toString(),
  });

  if (search) {
    params.append("search", search);
  }

  if (period === "custom" && start_date && end_date) {
    params.append("from", start_date);
    params.append("to", end_date);
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/customers?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal memuat data daftar pelanggan.");
  }

  const data = await response.json();

  const parsedData = customerListSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Customer List Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data daftar pelanggan.");
  }

  return parsedData.data;
};
