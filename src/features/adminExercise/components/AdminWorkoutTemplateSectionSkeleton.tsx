import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const AdminWorkoutTemplatesSectionSkeleton = () => {
  return (
    <div className="mt-8">
      <Skeleton className="h-8 w-52" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-card p-5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-7 w-44" />

            <div className="mt-5 space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <Skeleton className="mt-6 h-10 w-full sm:w-32" />
          </Card>
        ))}
      </div>
    </div>
  );
};
