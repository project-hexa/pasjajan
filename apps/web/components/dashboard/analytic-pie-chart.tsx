"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart";
import { cn } from "@workspace/ui/lib/utils";
import { Pie, PieChart } from "recharts";

interface AnalyticPieChartProps {
  data: {
    name: string;
    value: number;
    fill: string;
  }[];
  config: ChartConfig;
  className?: string;
}

export default function AnalyticPieChart({
  data,
  className,
  config,
}: AnalyticPieChartProps) {
  return (
    <ChartContainer
      config={config}
      className={cn("mx-auto aspect-square", className)}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={40} />
      </PieChart>
    </ChartContainer>
  );
}
