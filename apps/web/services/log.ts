import { logSchema } from "@/lib/schema/log.schema";
import { getToken } from "@/lib/utils";

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/logs?${email ? `email=${email}&` : ""}${
      from ? `from=${from}&` : ""
    }${to ? `to=${to}&` : ""}${page ? `page=${page}&` : ""}${
      perPage ? `perPage=${perPage}` : ""
    }`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal memuat data log aktivitas.");
  }

  const data = await response.json();

  const parsedData = logSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Log Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data log aktivitas.");
  }

  return parsedData.data;
};
