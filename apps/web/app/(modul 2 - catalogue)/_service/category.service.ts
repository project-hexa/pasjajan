import { handleApiRequest } from "@/lib/utils/handle-api-request";
import { handleApiResponse } from "@/lib/utils/handle-api-response";
import { Category } from "@/types/product";

export const categoryService = {
  getCategory: async () =>
    await handleApiResponse<{data: Category[]}>(
      async (opts?: { ssr: boolean }) =>
        await handleApiRequest.get<{data: Category[]}>("/categories", {
          ssr: opts?.ssr ?? false
        }),
    ),
};
