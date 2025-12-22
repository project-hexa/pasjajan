import { api, createServerApi } from "./axios";
import { Store, Product, Promo } from "../../types/api";

type RequestOptions = {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  defaultErrorMessage?: string;
};

export const handleApiRequest = {
  async get<T>(url: string, options?: RequestOptions): Promise<T> {
    const res = await api.get(url, { params: options?.params, headers: options?.headers });
    return res.data as T;
  },
  async post<T>(url: string, payload?: unknown, options?: RequestOptions): Promise<T> {
    const res = await api.post(url, payload, { headers: options?.headers });
    return res.data as T;
  },
  async patch<T>(url: string, payload?: unknown, options?: RequestOptions): Promise<T> {
    const res = await api.patch(url, payload, { headers: options?.headers });
    return res.data as T;
  },
  async delete<T>(url: string, options?: RequestOptions): Promise<T> {
    const res = await api.delete(url, { params: options?.params, headers: options?.headers });
    return res.data as T;
  },
  async serverGet<T>(url: string, options?: RequestOptions): Promise<T> {
    const serverApi = await createServerApi();
    const res = await serverApi.get(url, { params: options?.params, headers: options?.headers });
    return res.data as T;
  },
};

export const StoreService = {
  getAll: () =>
    handleApiRequest.get<Store[]>("/stores", {
      defaultErrorMessage: "Gagal memuat daftar toko",
    }),

  getById: (id: string | number) => handleApiRequest.get<Store>(`/stores/${id}`),
};

export const ProductService = {
  getAll: () =>
    handleApiRequest.get<Product[]>("/products", {
      defaultErrorMessage: "Gagal memuat produk",
    }),
};

export const PromoService = {
  getActive: () => handleApiRequest.get<Promo[]>("/promos"),
};