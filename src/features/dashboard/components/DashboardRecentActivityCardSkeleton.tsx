import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const DashboardRecentActivityCardSkeleton = () => {
  return (
    <Card className="bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-20" />
      </div>

      <Skeleton className="mt-3 h-6 w-56 max-w-full" />

      <div className="mt-4 divide-y divide-border">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-3 py-4 sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <Skeleton className="h-4 w-20 shrink-0" />

              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-40 max-w-full" />
                <Skeleton className="mt-2 h-4 w-56 max-w-full" />
              </div>
            </div>

            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
          </div>
        ))}
      </div>
    </Card>
  );
};
