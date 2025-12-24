import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function OrderLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <Skeleton className="h-5 w-40" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-start gap-4">
          <Skeleton className="h-8 w-8 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-5 w-32" />
        </div>
      </CardContent>

      <CardFooter className="justify-between">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-24" />
      </CardFooter>
    </Card>
  );
}

export function OrderListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <OrderLoadingSkeleton key={i} />
      ))}
    </div>
  );
}
