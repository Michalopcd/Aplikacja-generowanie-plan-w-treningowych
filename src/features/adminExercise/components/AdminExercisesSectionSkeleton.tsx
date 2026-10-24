import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const AdminExercisesSectionSkeleton = () => {
  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-3 h-4 w-72 max-w-full" />
        </div>

        <Skeleton className="h-11 w-full sm:w-40" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-card p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-8 w-16" />
          </Card>
        ))}
      </div>

      <Card className="mt-6 bg-card p-5">
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-56 max-w-full" />
              </div>

              <div className="flex gap-2">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
