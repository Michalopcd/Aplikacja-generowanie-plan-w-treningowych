import { useDashboardPlanProgress } from "../hooks/useDashboardPlanProgress";
import { LockKeyhole } from "lucide-react";
const DashboardPlanProgress = () => {
  const { stages } = useDashboardPlanProgress();

  return (
    <section className="w-full rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-white">
        Twój plan
      </h2>

      <div className="mt-6 grid grid-cols-3 gap-8">
        {stages.map((stage) => {
          const progress =
            (stage.completedWeeks / stage.totalWeeks) * 100;

          return (
            <div key={stage.title} className="min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted">
                    {stage.title}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white">
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

              <p className="mt-2 text-xs text-muted">
                {stage.completedWeeks}/{stage.totalWeeks} tyg.
              </p>

              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border">
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