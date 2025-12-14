import {
  notificationsMetricsSchema,
  notificationsSchema,
} from "@/lib/schema/notifications.schema";

interface EmailNotificationBody {
  title: string;
  body: string;
}

export const sendEmailNotification = async ({
  title,
  body,
}: EmailNotificationBody) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/send`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ title, body }),
    },
  );

  console.log(response);

  if (!response.ok) {
    throw new Error("Gagal mengirim notifikasi email.");
  }
};

export const getNotificationsMetrics = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications/metrics`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal memuat data metrik notifikasi.");
  }

  const data = await response.json();

  const parsedData = notificationsMetricsSchema.safeParse(data);

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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/notifications?page=${page ?? 1}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TEMPORARY_AUTH_TOKEN}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Gagal memuat data notifikasi.");
  }

  const data = await response.json();

  const parsedData = notificationsSchema.safeParse(data);

  if (!parsedData.success) {
    console.error("Notifications Schema Validation Error:", parsedData.error);
    throw new Error("Gagal memuat data notifikasi.");
  }

  return parsedData.data;
};
