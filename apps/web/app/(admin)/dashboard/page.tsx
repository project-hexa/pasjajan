import AnalyticCard from "@/components/dashboard/analytic-card";

const analyticsData = [
  {
    title: "Total Revenue",
    growth: "+12%",
    value: "Rp177.841.124",
    description: "Trending up this month",
  },
  {
    title: "Total Units Sold",
    growth: "+8%",
    value: "1.234",
    description: "Trending up this month",
  },
  {
    title: "Avg. Order Value",
    growth: "+5%",
    value: "Rp143.567",
    description: "Stable compared to last month",
  },
  {
    title: "Profit Margin",
    growth: "-2%",
    value: "25%",
    description: "Slight decrease this month",
  },
];

export default function DashboardPage() {
  return (
    <section>
      <div className="flex gap-4">
        {analyticsData.map((data) => (
          <AnalyticCard
            key={data.title}
            title={data.title}
            growth={data.growth}
            value={data.value}
            description={data.description}
          />
        ))}
      </div>
    </section>
  );
}
