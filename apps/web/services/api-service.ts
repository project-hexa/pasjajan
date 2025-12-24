const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) return [];

    const result = await response.json();
    
    if (result.data?.data && Array.isArray(result.data.data)) {
      return result.data.data;
    }
    
    if (result.data && Array.isArray(result.data)) {
      return result.data;
    }

    if (Array.isArray(result)) {
      return result;
    }
    
    return [];
  } catch (error) {
    console.error("Fetch error:", error);
    return [];
  }
};

export const StoreService = {
  getAll: () => apiFetch("/stores"),
  getById: (id: string | number) => apiFetch(`/stores/${id}`),
};

export const ProductService = {
  getAll: () => apiFetch("/products"),
  getById: (id: string | number) => apiFetch(`/products/${id}`),
};

export const PromoService = {
  getActive: () => apiFetch("/promos"),
};