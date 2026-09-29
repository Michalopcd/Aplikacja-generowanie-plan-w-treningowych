import { LockKeyhole } from "lucide-react";
import { useDashboardPlanProgress } from "../hooks/useDashboardPlanProgress";

const DashboardPlanProgress = () => {
  const { stages } = useDashboardPlanProgress();

  return (
    <section className="w-full rounded-2xl border border-border bg-surface p-6">
      <p className="text-xl font-bold text-white">
        Twój plan
      </p>

      <div className="mt-4 grid grid-cols-3 gap-4">
        {stages.map((stage) => {
          const progress =
            (stage.completedWeeks / stage.totalWeeks) * 100;

          return (
            <div key={stage.title} className="min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-base text-muted">
                    {stage.title}
                  </p>

                  <p className="mt-2 text-base font-semibold text-white">
                    {stage.name}
                  </p>
                </div>

                {stage.isLocked && (
                  <LockKeyhole
                    size={18}
                    className="text-muted"
                  />
                )}
              </div>

              <p className="mt-4 text-sm text-muted">
                {stage.completedWeeks}/{stage.totalWeeks} tyg.
              </p>

              <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-success transition-all duration-300"
                  style={{
                    width: `${stage.isLocked ? 0 : progress}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DashboardPlanProgress;