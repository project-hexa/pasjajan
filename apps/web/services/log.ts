import { logSchema } from "@/lib/schema/log.schema";
import { api, createServerApi } from "@/lib/utils/axios";

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

  // Override with Mock Data (Client Side)
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock Client)",
      data: {
        logs: [
          {
            id: 1,
            user_id: 1,
            activity_type: "LOGIN",
            description: "User melakukan login",
            timestamp: new Date().toISOString(),
            ip_address: "127.0.0.1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: {
              id: 1,
              full_name: "Admin PasJajan",
              email: "admin@pasjajan.com"
            }
          },
          {
            id: 2,
            user_id: 2,
            activity_type: "ORDER_CREATED",
            description: "Membuat pesanan baru INV/20230101/001",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ip_address: "192.168.1.1",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: 2,
              full_name: "Customer Demo",
              email: "customer@demo.com"
            }
          }
        ],
        pagination: {
          current_page: 1,
          per_page: 10,
          total: 2,
          last_page: 1
        }
      }
    }
  };

  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const response = mockResponse;
  /*
  const response = await api.get("/logs", {
    params,
  });
  */

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
  const serverApi = await createServerApi();
  const params: Record<string, string> = {};

  if (email) params.email = email;
  if (from) params.from = from;
  if (to) params.to = to;
  if (page) params.page = page.toString();
  if (perPage) params.perPage = perPage.toString();

  // Override with Mock Data to avoid 403 error for now
  const mockResponse = {
    data: {
      success: true,
      message: "Data fetched successfully (Mock)",
      data: {
        logs: [
          {
            id: 1,
            user_id: 1,
            activity_type: "LOGIN",
            description: "User melakukan login",
            timestamp: new Date().toISOString(),
            ip_address: "127.0.0.1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: {
              id: 1,
              full_name: "Admin PasJajan",
              email: "admin@pasjajan.com"
            }
          },
          {
            id: 2,
            user_id: 2,
            activity_type: "ORDER_CREATED",
            description: "Membuat pesanan baru INV/20230101/001",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ip_address: "192.168.1.1",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString(),
            user: {
              id: 2,
              full_name: "Customer Demo",
              email: "customer@demo.com"
            }
          }
        ],
        pagination: {
          current_page: 1,
          per_page: 10,
          total: 2,
          last_page: 1
        }
      }
    }
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const response = mockResponse;
  /* 
  const response = await serverApi.get("/logs", {
    params,
  });
  */

  const parsedData = logSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Log Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data log aktivitas.");
  }

  return parsedData.data;
};
