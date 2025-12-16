import {
  notificationsMetricsSchema,
  notificationsSchema,
} from "@/lib/schema/notifications.schema";
import { api } from "@/lib/utils/axios";

interface EmailNotificationBody {
  title: string;
  body: string;
}

export const sendEmailNotification = async ({
  title,
  body,
}: EmailNotificationBody) => {
  const response = await api.post(
    "/notifications/send",
    { title, body },
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
      },
    },
  );

  console.log(response);
};

export const getNotificationsMetrics = async () => {
  const response = await api.get("/notifications/metrics", {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
    },
  });

  const parsedData = notificationsMetricsSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error(
      "Notifications Metrics Schema Validation Error:",
      parsedData.error,
    );
    throw new Error("Gagal memuat data metrik notifikasi.");
  }

  return parsedData.data;
};

export const getNotifications = async (page?: number) => {
  const response = await api.get("/notifications", {
    params: { page: page ?? 1 },
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
    },
  });

  const parsedData = notificationsSchema.safeParse(response.data);

  if (!parsedData.success) {
    console.error("Notifications Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data notifikasi.");
  }

  return parsedData.data;
};
