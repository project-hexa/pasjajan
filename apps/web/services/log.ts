import { logSchema } from "@/lib/schema/log.schema";
import { api, getApiWithAuth } from "@/lib/utils/axios";

interface LogParams {
  email?: string;
  from?: string;
  to?: string;
  page?: number;
  perPage?: number;
}

export const getLogs = async ({
  email,
  from,
  to,
  page,
  perPage,
}: LogParams) => {
  const params: Record<string, string> = {};

  if (email) params.email = email;
  if (from) params.from = from;
  if (to) params.to = to;
  if (page) params.page = page.toString();
  if (perPage) params.perPage = perPage.toString();

  const response = await api.get("/logs", {
    params,
  });

  const parsedData = logSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Log Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data log aktivitas.");
  }

  return parsedData.data;
};

// Server-side version for Server Components
export const getLogsServer = async ({
  email,
  from,
  to,
  page,
  perPage,
}: LogParams) => {
  const serverApi = await getApiWithAuth();
  const params: Record<string, string> = {};

  if (email) params.email = email;
  if (from) params.from = from;
  if (to) params.to = to;
  if (page) params.page = page.toString();
  if (perPage) params.perPage = perPage.toString();

  const response = await serverApi.get("/logs", {
    params,
  });

  const parsedData = logSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Log Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data log aktivitas.");
  }

  return parsedData.data;
};
