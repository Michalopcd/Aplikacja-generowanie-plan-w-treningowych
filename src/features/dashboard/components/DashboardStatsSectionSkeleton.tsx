import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const DashboardStatsSectionSkeleton = () => {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="bg-surface p-5">
          <Skeleton className="h-4 w-32" />

          <Skeleton className="mt-4 h-8 w-20" />

          <Skeleton className="mt-3 h-4 w-40 max-w-full" />

          <Skeleton className="mt-6 h-20 w-full" />
        </Card>
      ))}
    </section>
  );
};
