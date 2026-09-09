import { Link } from "react-router-dom";

import { Card } from "../../../ui/Card";
import { muscleGroupLabels,weekDayLabels,} from "../../training/constants/trainingLabels";
import { formatISODateToDisplayDate } from "../../training/utils/dateUtils";
import { useDashboardWorkoutReminder } from "../hooks/useDashboardWorkoutReminder";

type Props = {
  uid: string;
};

export const DashboardWorkoutReminderCard = ({ uid }: Props) => {
  const { isLoading, errorMessage, status, todayWorkout } =
    useDashboardWorkoutReminder(uid);

  if (isLoading) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Dzisiejszy trening</p>

        <p className="mt-3 text-sm text-muted">
          Sprawdzanie dzisiejszego treningu...
        </p>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Dzisiejszy trening</p>

        <p className="mt-3 text-sm text-muted">{errorMessage}</p>
      </Card>
    );
  }

  if (status === "no-active-plan") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Dzisiejszy trening</p>

        <p className="mt-2 text-xl font-bold">
          Nie masz jeszcze aktywnego planu
        </p>

        <p className="mt-3 text-sm leading-6 text-muted">
          Wygeneruj plan treningowy, aby dashboard mógł pokazywać przypomnienia
          o dzisiejszych treningach.
        </p>

        <Link
          to="/plan"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Przejdź do planu
        </Link>
      </Card>
    );
  }

  if (status === "no-workout-today") {
    return (
      <Card className="bg-surface p-6">
        <p className="text-sm font-semibold text-primary">Dzisiejszy trening</p>

        <h2 className="mt-2 text-xl font-bold">Dzisiaj nie masz treningu</h2>

        <p className="mt-3 text-sm leading-6 text-muted">
          Na dzisiaj nie ma zaplanowanego treningu. Możesz odpocząć albo
          sprawdzić swój aktualny plan.
        </p>

        <Link
          to="/plan"
          className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Przejdź do planu
        </Link>
      </Card>
    );
  }

  if (!todayWorkout) {
    return null;
  }

  const { workoutDay } = todayWorkout;

  return (
    <Card className="bg-surface p-6">
      <p className="text-sm font-semibold text-primary">Dzisiejszy trening</p>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-bold">{workoutDay.name}</p>

          <p className="mt-2 text-sm text-muted">
            {weekDayLabels[workoutDay.weekDay]},{" "}
            {formatISODateToDisplayDate(todayWorkout.scheduledDate)}
          </p>
        </div>

        <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {workoutDay.exercises.length} ćwiczeń
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Partie:{" "}
        {workoutDay.focusMuscleGroups
          .map((muscleGroup) => muscleGroupLabels[muscleGroup])
          .join(", ")}
      </p>

      {status === "workout-completed" ? (
        <p className="mt-5 rounded-xl border border-success/30 bg-success/10 p-4 text-sm font-semibold text-success">
          Dzisiejszy trening został już wykonany.
        </p>
      ) : (
        <p className="mt-5 rounded-xl border border-border bg-card p-4 text-sm text-muted">
          Masz dzisiaj trening do wykonania. Przejdź do planu i oznacz go jako
          wykonany po zakończeniu.
        </p>
      )}

      <Link
        to="/plan"
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
      >
        Przejdź do planu
      </Link>
    </Card>
  );
};
