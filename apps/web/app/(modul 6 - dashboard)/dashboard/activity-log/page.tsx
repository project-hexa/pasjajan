import ActivityLogClient from "@/app/(modul 6 - dashboard)/_components/activity-log-client";
import { getLogs } from "@/services/log";

interface ActivityLogPageProps {
  searchParams: Promise<{
    email?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function ActivityLog({
  searchParams,
}: ActivityLogPageProps) {
  const { email, from, to, page } = await searchParams;

  const currentPage = parseInt(page ?? "1", 10);

  const { data } = await getLogs({
    email,
    from,
    to,
    page: currentPage,
    perPage: 10,
  });

  return <ActivityLogClient initialData={data} />;
}
