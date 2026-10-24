import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const DashboardWorkoutReminderCardSkeleton = () => {
  return (
    <Card className="bg-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="mt-3 h-4 w-36" />
        </div>

        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <Skeleton className="mt-5 h-4 w-3/4" />

      <Skeleton className="mt-4 h-16 w-full rounded-xl" />
    </Card>
  );
};
