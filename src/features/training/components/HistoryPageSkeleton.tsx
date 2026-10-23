import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const HistoryPageSkeleton = () => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <Skeleton className="h-4 w-32" />

        <Skeleton className="mt-3 h-8 w-72 max-w-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-4/5 max-w-xl" />
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card
            key={index}
            className="bg-surface p-5"
          >
            <Skeleton className="h-3 w-28" />
            <Skeleton className="mt-3 h-7 w-36" />
          </Card>
        ))}
      </section>

      <Card className="bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-7 w-60 max-w-full" />
            <Skeleton className="mt-3 h-4 w-72 max-w-full" />
          </div>

          <Skeleton className="h-9 w-32" />
        </div>

        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-6 w-52 max-w-full" />
                  <Skeleton className="mt-3 h-4 w-40" />
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
              </div>

              <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map(
                  (_, detailIndex) => (
                    <div key={detailIndex}>
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="mt-2 h-5 w-28" />
                    </div>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>
    </section>
  );
};