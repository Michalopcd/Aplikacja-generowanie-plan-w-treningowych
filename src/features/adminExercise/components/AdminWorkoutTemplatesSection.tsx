import type { WorkoutPlanTemplate } from "../../training/workoutPlanTemplate";

import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import { ErrorState } from "../../../ui/ErrorState";
import { LoadingState } from "../../../ui/LoadingState";

type Props = {
  templates: WorkoutPlanTemplate[];
  isLoading: boolean;
  error: string;
  onEdit: (template: WorkoutPlanTemplate) => void;
};

export const AdminWorkoutTemplatesSection = ({
  templates,
  isLoading,
  error,
  onEdit,
}: Props) => {
  return (
    <div className="mt-8">
      <div>
        <h2 className="text-2xl font-bold">Szablony planów</h2>

        <p className="mt-2 text-sm text-muted">
          Zarządzaj układem planów wykorzystywanych przez generator.
        </p>
      </div>

      {isLoading ? (
        <div className="mt-6">
          <LoadingState message="Ładowanie szablonów planów..." />
        </div>
      ) : error ? (
        <div className="mt-6">
          <ErrorState message={error} />
        </div>
      ) : templates.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Brak szablonów planów"
            description="Nie znaleziono żadnych szablonów planów treningowych."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {templates.map((template) => (
            <Card key={template.id} className="bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Szablon planu
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Plan {template.trainingDaysPerWeek}
                    -dniowy
                  </h3>
                </div>

                <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {template.isActive ? "Aktywny" : "Nieaktywny"}
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {template.workoutDays.map((workoutDay) => (
                  <div
                    key={workoutDay.dayNumber}
                    className="rounded-xl border border-border bg-surface p-4"
                  >
                    <p className="text-sm font-semibold">{workoutDay.name}</p>

                    <p className="mt-1 text-xs text-muted">
                      {workoutDay.focusMuscleGroups.length} grup mięśniowych
                    </p>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => onEdit(template)}
                className="mt-5 w-full sm:w-auto"
              >
                Edytuj szablon
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
