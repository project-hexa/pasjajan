import axios, { AxiosAdapter, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

// --- GLOBAL MOCK ADAPTER ---
const mockAdapter: AxiosAdapter = async (config) => {
  const url = config.url || "";
  const method = config.method || "get";

  console.log(`[MOCK API] ${method.toUpperCase()} ${url}`);

  await new Promise(r => setTimeout(r, 500)); // Simulate delay

  let data: any = null;

  // 1. AUTH
  if (url.includes("/auth/login")) {
    data = {
      success: true,
      message: "Login Berhasil (Mock)",
      data: { token: "mock-token-123", user_data: { id: 1, full_name: "Admin PasJajan", name: "Admin", role: "admin" } }
    };
  }
  else if (url.includes("/user/profile")) {
    data = { success: true, data: { full_name: "Admin Demo", email: "admin@pasjajan.com", role: "admin" } };
  }

  // 2. DASHBOARD
  else if (url.includes("/reports/sales")) {
    data = {
      success: true, data: {
        summary: {
          total_customers: { value: 850, trend: "up", description: "+10%" },
          total_transactions: { value: "Rp 250jt", trend: "up", description: "+8%" },
          avg_transaction: { value: "Rp 100rb", trend: "stable", description: "0%" }
        },
        salesTrend: Array.from({ length: 12 }, (_, i) => ({ label: i + 1, date: "2025-01-01", value: Math.random() * 100, revenue: "1000000" })),
        topProducts: []
      }
    };
  }
  else if (url.includes("/customers/analytics")) {
    data = {
      success: true, data: {
        summary: {
          total_customers: { value: 1200, trend: "up", description: "+15%" },
          total_transactions: { value: "Rp 150jt", trend: "up", description: "+10%" },
          avg_transaction: { value: "Rp 120rb", trend: "down", description: "-2%" }
        },
        analytics: { purchase_trend: [], category_composition: [], purchase_frequency: [] }
      }
    };
  }
  else if (url.includes("/customers")) { // List
    data = { success: true, data: { customers: [], pagination: { total: 0, current_page: 1, last_page: 1 } } };
  }
  else if (url.includes("/logs")) {
    data = { success: true, data: { logs: [], pagination: { total: 0 } } };
  }
  else if (url.includes("/admin/promos")) {
    data = { success: true, data: { data: [], total: 0 } };
  }
  else if (url.includes("api.mapbox.com")) {
    // Mock Mapbox
    if (url.includes("reverse")) {
      data = { features: [{ properties: { full_address: "Jl. Demo Mock No. 1", place_formatted: "Jakarta Custom Place" } }] };
    } else if (url.includes("suggest")) {
      data = { suggestions: [{ name: "Lokasi Mock 1", mapbox_id: "mock1" }, { name: "Lokasi Mock 2", mapbox_id: "mock2" }] };
    } else if (url.includes("retrieve")) {
      data = { features: [{ geometry: { coordinates: [106.8456, -6.2088] } }] };
    }
  }

  // 3. DELIVERY & ORDERS
  else if (url.includes("/orders")) {
    data = { success: true, data: { orders: [] } }; // Empty list for real orders check
  }
  else if (url.includes("/delivery") && url.includes("/tracking")) {
    data = {
      success: true, data: {
        shipment_id: 123,
        status_utama: "DIKIRIM",
        timeline: [],
        driver: { nama: "Budi", plat_nomor: "B 1234", telepon: "0811" }
      }
    };
  }
  else if (url.includes("/notifications")) {
    data = {
      success: true, data: {
        unread_count: 5, total: 10,
        total_notifications: { value: 100, trend: "up", description: "+5%" },
        active_users: { value: 500, trend: "up", description: "Active" }
      }
    };
  }

  // DEFAULT FALLBACK
  if (!data) {
    console.warn(`[MOCK API] Unhandled URL: ${url}, returning generic success prop`);
    data = { success: true, data: [] };
  }

  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
    request: {}
  };
};

// --- CLIENT API ---
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  adapter: mockAdapter, // <--- FORCE ADAPTER
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Should not happen easily with Mock Adapter, but keep just in case
    return Promise.reject(error);
  },
);

// --- SERVER API ---
export const createServerApi = async () => {
  // Return same mocked instance for simplicity in Demo Mode
  return api;
};
