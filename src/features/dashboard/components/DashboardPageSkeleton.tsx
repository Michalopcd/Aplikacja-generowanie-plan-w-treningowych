import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const DashboardPageSkeleton = () => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <Skeleton className="h-4 w-24" />

        <Skeleton className="mt-3 h-8 w-64 max-w-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full max-w-xl" />
          <Skeleton className="h-4 w-4/5 max-w-lg" />
        </div>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-surface p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-3 h-3 w-32" />
          </Card>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-7 w-52 max-w-full" />
            </div>

            <Skeleton className="h-9 w-32 shrink-0" />
          </div>

          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-5 w-56 max-w-full" />
            <Skeleton className="h-4 w-36" />
          </div>

          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <Skeleton className="h-4 w-36 max-w-full" />
                    <Skeleton className="mt-2 h-3 w-24" />
                  </div>

                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-3 h-7 w-56 max-w-full" />
            </div>

            <Skeleton className="h-9 w-24 shrink-0" />
          </div>

          <div className="mt-6 space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-4"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-3 h-5 w-48 max-w-full" />

                <div className="mt-3 flex gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </section>
  );
};
