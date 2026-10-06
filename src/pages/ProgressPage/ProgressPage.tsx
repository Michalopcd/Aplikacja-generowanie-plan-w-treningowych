import { Link } from "react-router-dom";

import {
  experienceLevelLabels,
  goalLabels,
  locationLabels,
} from "../../features/training/constants/trainingLabels";

import { useProgressData } from "../../features/training/hooks/useProgressData";

import {
  formatDateToISO,
  formatISODateToDisplayDate,
} from "../../features/training/utils/dateUtils";
import { createProgressStats } from "../../features/training/utils/progressStats";
import { createWorkoutSchedule } from "../../features/training/utils/workoutSchedule";

import { ROUTES } from "../../utils/route";

import { Card } from "../../ui/Card";
import { EmptyState } from "../../ui/EmptyState";
import { ErrorState } from "../../ui/ErrorState";
import { LoadingState } from "../../ui/LoadingState";

const ProgressPage = () => {
  const { plan, completedWorkouts, isLoading, errorMessage } =
    useProgressData();

  if (isLoading) {
    return <LoadingState message="Ładowanie postępów..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (!plan) {
    return (
      <section className="w-full">
        <Card className="mx-auto max-w-md bg-surface p-6">
          <EmptyState
            title="Brak aktywnego planu"
            description="Nie znaleziono aktywnego planu treningowego. Wygeneruj plan, aby móc śledzić swoje postępy."
            action={
              <Link
                to={ROUTES.PLAN}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Przejdź do planu
              </Link>
            }
          />
        </Card>
      </section>
    );
  }

  const today = formatDateToISO(new Date());

  const workoutSchedule = createWorkoutSchedule(plan);

  const currentWeek = workoutSchedule.find(
    (scheduleWeek) =>
      today >= scheduleWeek.weekStartDate && today <= scheduleWeek.weekEndDate,
  );

  const progressStats = createProgressStats({
    workoutSchedule,
    completedWorkouts,
    currentWeekNumber: currentWeek?.weekNumber ?? null,
  });

  const recentCompletedWorkouts = completedWorkouts
    .slice()
    .sort(
      (firstWorkout, secondWorkout) =>
        secondWorkout.completedAt.getTime() -
        firstWorkout.completedAt.getTime(),
    )
    .slice(0, 5);

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">Twoje postępy</p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Statystyki planu treningowego
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Tutaj możesz sprawdzić, ile treningów zostało zaplanowanych, ile
          zostało wykonanych oraz jaki procent planu jest już ukończony.
        </p>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Zaplanowane treningi
          </p>

          <p className="mt-2 text-3xl font-bold">
            {progressStats.plannedWorkoutsCount}
          </p>
        </Card>

        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Wykonane treningi
          </p>

          <p className="mt-2 text-3xl font-bold">
            {progressStats.completedWorkoutsCount}
          </p>
        </Card>

        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Ukończenie planu
          </p>

          <p className="mt-2 text-3xl font-bold">
            {progressStats.completionPercentage}%
          </p>
        </Card>

        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Aktualny tydzień
          </p>

          <p className="mt-2 text-3xl font-bold">
            {progressStats.currentWeekCompletedWorkoutsCount}

            <span className="text-base font-semibold text-muted">
              {" "}
              / {currentWeek?.workouts.length ?? 0}
            </span>
          </p>
        </Card>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="bg-surface p-6">
          <h2 className="text-xl font-bold">Aktywny plan</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted">Cel</p>

              <p className="mt-1 font-semibold">{goalLabels[plan.goal]}</p>
            </div>

            <div>
              <p className="text-sm text-muted">Miejsce treningu</p>

              <p className="mt-1 font-semibold">
                {locationLabels[plan.trainingLocation]}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted">Poziom</p>

              <p className="mt-1 font-semibold">
                {experienceLevelLabels[plan.experienceLevel]}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted">Treningi tygodniowo</p>

              <p className="mt-1 font-semibold">
                {plan.workoutDays.length} dni
              </p>
            </div>

            <div>
              <p className="text-sm text-muted">Czas trwania</p>

              <p className="mt-1 font-semibold">{plan.durationWeeks} tygodni</p>
            </div>

            <div>
              <p className="text-sm text-muted">Start planu</p>

              <p className="mt-1 font-semibold">
                {formatISODateToDisplayDate(plan.startDate)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-surface p-6">
          <h2 className="text-xl font-bold">Aktualny tydzień</h2>

          {currentWeek ? (
            <div className="mt-5">
              <p className="text-sm font-semibold text-primary">
                Tydzień {currentWeek.weekNumber}
              </p>

              <p className="mt-1 text-muted">
                {formatISODateToDisplayDate(currentWeek.weekStartDate)} -{" "}
                {formatISODateToDisplayDate(currentWeek.weekEndDate)}
              </p>

              <p className="mt-4 text-sm text-muted">
                W tym tygodniu wykonano:
              </p>

              <p className="mt-1 text-2xl font-bold">
                {progressStats.currentWeekCompletedWorkoutsCount} z{" "}
                {currentWeek.workouts.length} treningów
              </p>
            </div>
          ) : (
            <EmptyState
              title="Brak aktualnego tygodnia"
              description="Aktualna data nie znajduje się w zakresie planu treningowego."
            />
          )}
        </Card>
      </section>

      <Card className="bg-surface p-6">
        <h2 className="text-xl font-bold">Ostatnio wykonane treningi</h2>

        {recentCompletedWorkouts.length === 0 ? (
          <EmptyState
            title="Brak wykonanych treningów"
            description="Nie masz jeszcze żadnych wykonanych treningów. Oznacz trening jako wykonany w zakładce „Mój plan”, aby zobaczyć tutaj historię."
            action={
              <Link
                to={ROUTES.PLAN}
                className="mt-2 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Przejdź do planu
              </Link>
            }
          />
        ) : (
          <div className="mt-5 space-y-3">
            {recentCompletedWorkouts.map((completedWorkout) => (
              <div
                key={completedWorkout.id}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold">
                      Trening {completedWorkout.trainingNumber} —{" "}
                      {completedWorkout.workoutDayName}
                    </p>

                    <p className="mt-1 text-sm text-muted">
                      Tydzień {completedWorkout.weekNumber} •{" "}
                      {formatISODateToDisplayDate(
                        completedWorkout.scheduledDate,
                      )}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {completedWorkout.exerciseCount} ćwiczeń
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-center">
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90 sm:w-auto"
        >
          Wróć do dashboardu
        </Link>
      </div>
    </section>
  );
};

export default ProgressPage;
