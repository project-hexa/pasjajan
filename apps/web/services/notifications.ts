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
  // Mock Send
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log("Mock Notification Sent:", { title, body });
  return { success: true, message: "Notifikasi berhasil dikirim (Mock)" };
  /*
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
  */
};

export const getNotificationsMetrics = async () => {
  // Mock Metrics
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    data: {
      total_notifications: {
        value: 154,
        trend: "up",
        description: "+12% vs last week",
      },
      active_users: {
        value: 1250,
        trend: "stable",
        description: "Active in last 30 days",
      },
    },
  };
  /*
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
  */
};

export const getNotifications = async (page?: number) => {
  // Mock List
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    data: {
      notifications: [
        { id: 1, title: "Halo", body: "Selamat datang di dashboard", created_at: new Date().toISOString() },
        { id: 2, title: "Info", body: "Sistem berjalan lancar", created_at: new Date().toISOString() }
      ],
      pagination: {
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 2
      }
    }
  };
  /*
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
  */
};
