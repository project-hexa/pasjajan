import { AxiosRequestConfig, AxiosResponse, isAxiosError } from "axios";
import { api, createServerAPI } from "./axios";

const wrapTryCatch = async <T>(
  callback: () => Promise<AxiosResponse>,
  defaultErrorMessage?: string,
): Promise<T> => {
  try {
    const { data } = await callback();

    if (!data.success) {
      throw data;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("API Request: ", data);
    }

    return data.data;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.log("API Request: ", error);
    }

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
  ssr?: boolean;
  defaultErrorMessage?: string;
}

export const handleApiRequest = {
  get: async <TResponse = unknown>(url: string, config?: RequestConfig) =>
    await wrapTryCatch<TResponse>(
      (config?.ssr ?? false)
        ? async () =>
            (await createServerAPI()).get<APIResponse<TResponse>>(url, config)
        : () => api.get<APIResponse<TResponse>>(url, config),
      config?.defaultErrorMessage,
    ),
  post: async <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ) =>
    await wrapTryCatch<TResponse>(
      (config?.ssr ?? false)
        ? async () =>
            (await createServerAPI()).post<APIResponse<TResponse>>(
              url,
              data,
              config,
            )
        : () => api.post<APIResponse<TResponse>>(url, data, config),
      config?.defaultErrorMessage,
    ),
  put: async <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ) =>
    await wrapTryCatch<TResponse>(
      (config?.ssr ?? false)
        ? async () =>
            (await createServerAPI()).put<APIResponse<TResponse>>(
              url,
              data,
              config,
            )
        : () => api.put<APIResponse<TResponse>>(url, data, config),
      config?.defaultErrorMessage,
    ),
  patch: async <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ) =>
    await wrapTryCatch<TResponse>(
      (config?.ssr ?? false)
        ? async () =>
            (await createServerAPI()).patch<APIResponse<TResponse>>(
              url,
              data,
              config,
            )
        : () => api.patch<APIResponse<TResponse>>(url, data, config),
      config?.defaultErrorMessage,
    ),

  delete: async <TResponse = unknown>(url: string, config?: RequestConfig) =>
    await wrapTryCatch<TResponse>(
      (config?.ssr ?? false)
        ? async () =>
            (await createServerAPI()).delete<APIResponse<TResponse>>(
              url,
              config,
            )
        : () => api.delete<APIResponse<TResponse>>(url, config),
      config?.defaultErrorMessage,
    ),
};
