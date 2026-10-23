import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const TrainingPlanPageSkeleton = () => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <Skeleton className="h-4 w-20" />

        <Skeleton className="mt-3 h-8 w-64 max-w-full" />

        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full max-w-2xl" />
          <Skeleton className="h-4 w-4/5 max-w-xl" />
        </div>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-surface">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-6 w-28" />
          </Card>
        ))}
      </section>

      <section className="space-y-6">
        <Card className="bg-surface p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-7 w-48 max-w-full" />
              <Skeleton className="mt-3 h-4 w-32" />
            </div>

            <Skeleton className="h-9 w-32" />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, workoutIndex) => (
              <Card key={workoutIndex} className="bg-card p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="mt-3 h-7 w-44 max-w-full" />
                    <Skeleton className="mt-3 h-4 w-36" />
                  </div>

                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>

                <Skeleton className="mt-5 h-4 w-3/4" />

                <div className="mt-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, exerciseIndex) => (
                    <div
                      key={exerciseIndex}
                      className="rounded-xl border border-border bg-surface p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex-1">
                          <Skeleton className="h-5 w-40 max-w-full" />
                          <Skeleton className="mt-2 h-3 w-28" />
                        </div>

                        <Skeleton className="h-9 w-28" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex border-t border-border pt-4 sm:justify-end">
                  <Skeleton className="h-10 w-full sm:w-44" />
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </section>

      <div className="mt-8 flex justify-center">
        <Skeleton className="h-10 w-full sm:w-48" />
      </div>
    </section>
  );
};
