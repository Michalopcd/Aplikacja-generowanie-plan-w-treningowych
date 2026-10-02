import { Link } from "react-router-dom";

import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import { ErrorState } from "../../../ui/ErrorState";
import { LoadingState } from "../../../ui/LoadingState";

import {
  muscleGroupLabels,
  weekDayLabels,
} from "../../training/constants/trainingLabels";
import { formatISODateToDisplayDate ,getWeekDayFromISODate} from "../../training/utils/dateUtils";
import { useDashboardWorkoutReminder } from "../hooks/useDashboardWorkoutReminder";

type Props = {
  uid: string;
};

export const DashboardWorkoutReminderCard = ({
  uid,
}: Props) => {
  const {
    isLoading,
    errorMessage,
    status,
    todayWorkout,
  } = useDashboardWorkoutReminder(uid);

  if (isLoading) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Dzisiejszy trening
        </p>

        <LoadingState message="Sprawdzanie dzisiejszego treningu..." />
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Dzisiejszy trening
        </p>

        <ErrorState message={errorMessage} />
      </Card>
    );
  }

  if (status === "no-active-plan") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Dzisiejszy trening
        </p>

        <EmptyState
          title="Nie masz jeszcze aktywnego planu"
          description="Wygeneruj plan treningowy, aby dashboard mógł pokazywać przypomnienia o dzisiejszych treningach."
          action={
            <Link
              to="/plan"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          }
        />
      </Card>
    );
  }

  if (status === "no-workout-today") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Dzisiejszy trening
        </p>

        <EmptyState
          title="Dzisiaj nie masz treningu"
          description="Na dzisiaj nie ma zaplanowanego treningu. Możesz odpocząć albo sprawdzić swój aktualny plan."
          action={
            <Link
              to="/plan"
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          }
        />
      </Card>
    );
  }

  if (!todayWorkout) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">
          Dzisiejszy trening
        </p>

        <ErrorState message="Nie udało się wyświetlić dzisiejszego treningu." />
      </Card>
    );
  }

  const { workoutDay } = todayWorkout;

  return (
    <Card className="bg-surface p-6">
      <p className="text-sm font-semibold text-primary">
        Dzisiejszy trening
      </p>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-bold">
            {workoutDay.name}
          </p>

          <p className="mt-2 text-sm text-muted">
  {weekDayLabels[
    getWeekDayFromISODate(todayWorkout.scheduledDate)
  ]}
  ,{" "}
  {formatISODateToDisplayDate(
    todayWorkout.scheduledDate,
  )}
</p>
        </div>

        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {workoutDay.exercises.length} ćwiczeń
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Partie:{" "}
        {workoutDay.focusMuscleGroups
          .map(
            (muscleGroup) =>
              muscleGroupLabels[muscleGroup],
          )
          .join(", ")}
      </p>

      {status === "workout-completed" ? (
        <p className="mt-4 rounded-xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success">
          Dzisiejszy trening został już wykonany.
        </p>
      ) : (
        <p className="mt-4 rounded-xl border border-border bg-card p-4 text-sm text-muted">
          Masz dzisiaj trening do wykonania. Przejdź do
          planu i oznacz go jako wykonany po zakończeniu.
        </p>
      )}

      <div className="mt-4 flex justify-center sm:justify-start">
  <Link
    to="/plan"
    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
  >
    Przejdź do planu
  </Link>
</div>
    </Card>
  );
};