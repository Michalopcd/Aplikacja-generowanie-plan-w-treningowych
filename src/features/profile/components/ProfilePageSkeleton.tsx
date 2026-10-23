import { Card } from "../../../ui/Card";
import { Skeleton } from "../../../ui/Skeleton";

export const ProfilePageSkeleton = () => {
  return (
    <section className="w-full">
      <div className="mb-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-8 w-48" />
        <Skeleton className="mt-3 h-4 w-72 max-w-full" />
      </div>

      <Card className="bg-surface p-6">
        <div className="space-y-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-3 w-24" />
              <Skeleton className="mt-2 h-5 w-40" />
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};
