import { AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";
import { api } from "./axios";

const wrapTryCatch = async <T>(
  callback: () => Promise<AxiosResponse>,
  defaultErrorMessage?: string,
): Promise<T> => {
  try {
    const { data } = await callback();

    if (!data.success) {
      throw data;
    }

    return data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw {
        message: error.response?.data?.message ?? defaultErrorMessage,
        description: error.response?.data.description,
        errors: error.response?.data?.errors,
        status: error.response?.status,
      } satisfies APIError;
    }

    throw error;
  }
};

interface RequestConfig extends AxiosRequestConfig {
  defaultErrorMessage?: string;
}

export const handleApiRequest = {
  get: async <TResponse = unknown>(url: string, config?: RequestConfig) =>
    await wrapTryCatch<TResponse>(
      () => api.get<APIResponse<TResponse>>(url, config),
      config?.defaultErrorMessage,
    ),
  post: async <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ) =>
    await wrapTryCatch<TResponse>(
      () => api.post<APIResponse<TResponse>>(url, data, config),
      config?.defaultErrorMessage,
    ),
  put: async <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ) =>
    await wrapTryCatch<TResponse>(
      () => api.put<APIResponse<TResponse>>(url, data, config),
      config?.defaultErrorMessage,
    ),
  patch: async <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ) =>
    await wrapTryCatch<TResponse>(
      () => api.patch<APIResponse<TResponse>>(url, data, config),
      config?.defaultErrorMessage,
    ),

  delete: async <TResponse = unknown>(url: string, config?: RequestConfig) =>
    await wrapTryCatch<TResponse>(
      () => api.delete<APIResponse<TResponse>>(url, config),
      config?.defaultErrorMessage,
    ),
};
