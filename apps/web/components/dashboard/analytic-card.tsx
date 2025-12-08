import { Icon } from "@workspace/ui/components/icon";
import { cn } from "@workspace/ui/lib/utils";

interface AnalyticCardProps {
  title: string;
  growth?: string;
  value: string;
  description?: string;
  className?: string;
}

export default function AnalyticCard(props: AnalyticCardProps) {
  const { title, growth, value, description, className } = props;

  const positiveGrowth = growth?.startsWith("+");

  return (
    <div
      className={cn(
        "w-full space-y-2 rounded-2xl bg-[#F7FFFB] p-4 shadow-xl",
        className,
      )}
    >
      <div className="flex justify-between">
        <h3 className="text-xl font-light">{title}</h3>
        {growth && (
          <div className="flex items-center rounded-full border px-2 py-1 text-xs">
            {!positiveGrowth ? (
              <Icon icon={"lucide:trending-down"} size={12} />
            ) : (
              <Icon icon={"lucide:trending-up"} size={12} />
            )}
            <span>{growth}</span>
          </div>
        )}
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <p>{description}</p>
    </div>
  );
}
