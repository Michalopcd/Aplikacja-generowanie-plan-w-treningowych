import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const ProgressPageSkeleton = () => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <Skeleton className="h-4 w-28" />

        <Skeleton className="mt-3 h-8 w-72 max-w-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-4/5 max-w-xl" />
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-surface p-5">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="mt-3 h-8 w-20" />
          </Card>
        ))}
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="bg-surface p-6">
          <Skeleton className="h-7 w-36" />

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-2 h-5 w-32" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-surface p-6">
          <Skeleton className="h-7 w-40" />

          <div className="mt-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-4 w-44" />
            <Skeleton className="mt-5 h-4 w-40" />
            <Skeleton className="mt-3 h-7 w-32" />
          </div>
        </Card>
      </section>

      <Card className="bg-surface p-6">
        <Skeleton className="h-7 w-56 max-w-full" />

        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Skeleton className="h-5 w-52 max-w-full" />
                  <Skeleton className="mt-2 h-4 w-36" />
                </div>

                <Skeleton className="h-6 w-20 rounded-full" />
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
