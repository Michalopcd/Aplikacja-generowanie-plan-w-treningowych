import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const CalendarPageSkeleton = () => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <Skeleton className="h-4 w-20" />

        <Skeleton className="mt-3 h-8 w-64 max-w-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-4/5 max-w-lg" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="bg-surface p-4 md:p-6 xl:col-span-2">
          <div className="mb-6 flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-10" />
              <Skeleton className="h-9 w-10" />
              <Skeleton className="h-9 w-20" />
            </div>

            <Skeleton className="h-7 w-40" />
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton
                key={`header-${index}`}
                className="h-5 w-full"
              />
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => (
              <Skeleton
                key={`day-${index}`}
                className="h-16 w-full md:h-24"
              />
            ))}
          </div>
        </Card>

        <Card className="hidden bg-surface p-6 xl:block">
          <Skeleton className="h-4 w-28" />

          <Skeleton className="mt-3 h-7 w-48" />

          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />

            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </Card>
      </div>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>
    </section>
  );
};