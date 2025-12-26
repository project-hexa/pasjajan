import { Icon } from "@workspace/ui/components/icon";

interface OrderEmptyStateProps {
  message?: string;
}

export function OrderEmptyState({
  message = "Belum ada pesanan",
}: OrderEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon
        icon="solar:box-outline"
        className="mb-4 text-6xl text-muted-foreground"
      />
      <h3 className="mb-2 text-lg font-semibold">{message}</h3>
      <p className="text-sm text-muted-foreground">
        Pesanan yang kamu cari belum tersedia
      </p>
    </div>
  );
}
