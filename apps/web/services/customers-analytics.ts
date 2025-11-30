import {
  CustomerAnalyticResponse,
  customerAnalyticSchema,
  customerListSchema,
} from "@/lib/schema/customers-analytics.schema";
import { getToken } from "@/lib/utils";

interface CustomerAnalyticParams {
  period: "30h" | "yearly" | "daily" | "custom";
}

interface CustomerListParams {
  perPage: number;
  page: number;
  period: "30h" | "yearly" | "daily" | "custom";
  sort: "highest" | "lowest";
}

export const getCustomersAnalytics = async ({
  period,
}: CustomerAnalyticParams): Promise<CustomerAnalyticResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customers/analytics?period=${period}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

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
}: CustomerListParams) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/customers?period=${period}&per_page=${perPage}&page=${page}&sort=${sort}`,
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
