"use client";

import { exportReportSales } from "@/services/report-sales";
import { Button } from "@workspace/ui/components/button";

export default function ExportCsvButton({
  period,
}: {
  period: "monthly" | "yearly" | "daily" | "custom";
}) {
  return (
    <Button
      onClick={() => {
        exportReportSales({
          period,
        });
      }}
      className="ml-16"
    >
      Export CSV
    </Button>
  );
}
