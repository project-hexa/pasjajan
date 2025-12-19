"use client";

import { getNotificationsMetrics } from "@/services/notifications";
import { useEffect, useState } from "react";
import type { NotificationsMetricsResponse } from "@/lib/schema/notifications.schema";
import AnalyticCard from "@/app/(modul 6 - dashboard)/_components/analytic-card";

export default function NotificationsMetrics() {
  const [metrics, setMetrics] = useState<NotificationsMetricsResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await getNotificationsMetrics();
        setMetrics(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Gagal memuat metrik notifikasi",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return (
      <>
        <AnalyticCard
          title="Total Notifikasi"
          value="..."
          growth="..."
          description="Memuat..."
          className="w-full"
        />
        <AnalyticCard
          title="Pengguna Aktif"
          value="..."
          growth="..."
          description="Memuat..."
          className="w-full"
        />
      </>
    );
  }

  if (error || !metrics) {
    return (
      <>
        <AnalyticCard
          title="Total Notifikasi"
          value="Error"
          growth=""
          description={error || "Gagal memuat data"}
          className="w-full"
        />
        <AnalyticCard
          title="Pengguna Aktif"
          value="Error"
          growth=""
          description={error || "Gagal memuat data"}
          className="w-full"
        />
      </>
    );
  }

  return (
    <>
      <AnalyticCard
        title="Total Notifikasi"
        value={metrics.data.total_notifications.value.toLocaleString("id-ID")}
        growth={metrics.data.total_notifications.trend}
        description={metrics.data.total_notifications.description}
        className="w-full"
      />
      <AnalyticCard
        title="Pengguna Aktif"
        value={metrics.data.active_users.value.toLocaleString("id-ID")}
        growth={metrics.data.active_users.trend}
        description={metrics.data.active_users.description}
        className="w-full"
      />
    </>
  );
}
