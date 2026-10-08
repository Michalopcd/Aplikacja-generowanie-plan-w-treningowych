import { Link } from "react-router-dom";

import { goalLabels } from "../../features/training/constants/trainingLabels";
import { useWorkoutHistory } from "../../features/training/hooks/useWorkoutHistory";

import { formatISODateToDisplayDate } from "../../features/training/utils/dateUtils";

import { ROUTES } from "../../utils/route";

import { Card } from "../../ui/Card";
import { EmptyState } from "../../ui/EmptyState";
import { ErrorState } from "../../ui/ErrorState";
import { LoadingState } from "../../ui/LoadingState";

const formatCompletedTime = (date: Date): string => {
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryPage = () => {
  const { plan, completedWorkouts, isLoading, errorMessage } =
    useWorkoutHistory();

  if (isLoading) {
    return <LoadingState message="Ładowanie historii treningów..." />;
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
            description="Nie znaleziono aktywnego planu treningowego. Wygeneruj plan, aby móc zapisywać i przeglądać historię treningów."
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

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">
          Historia aktywności
        </p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Historia wykonanych treningów
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Tutaj znajdziesz listę treningów oznaczonych jako wykonane w ramach
          aktualnego planu treningowego.
        </p>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Aktywny plan
          </p>

          <p className="mt-2 text-lg font-semibold">{plan.name}</p>
        </Card>

        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Wykonane treningi
          </p>

          <p className="mt-2 text-3xl font-bold">{completedWorkouts.length}</p>
        </Card>

        <Card className="bg-surface p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Cel planu
          </p>

          <p className="mt-2 text-lg font-semibold">{goalLabels[plan.goal]}</p>
        </Card>
      </section>

      <Card className="bg-surface p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Lista wykonanych treningów</h2>

            <p className="mt-1 text-sm text-muted">
              Najnowsze treningi są wyświetlane na górze listy.
            </p>
          </div>

          {completedWorkouts.length > 0 && (
            <Link
              to={ROUTES.PLAN}
              className="w-fit rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Przejdź do planu
            </Link>
          )}
        </div>

        {completedWorkouts.length === 0 ? (
          <EmptyState
            title="Brak wykonanych treningów"
            description="Nie masz jeszcze żadnych wykonanych treningów. Wejdź w zakładkę „Mój plan” i oznacz trening jako wykonany."
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
          <div className="mt-6 space-y-4">
            {completedWorkouts.map((completedWorkout) => (
              <div
                key={completedWorkout.id}
                className="rounded-xl border border-border bg-card p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-primary">
                      Trening {completedWorkout.trainingNumber}
                    </p>

                    <h3 className="mt-1 text-xl font-bold">
                      {completedWorkout.workoutDayName}
                    </h3>

                    <p className="mt-2 text-sm text-zinc-300">
                      Tydzień {completedWorkout.weekNumber} • zaplanowany na{" "}
                      {formatISODateToDisplayDate(
                        completedWorkout.scheduledDate,
                      )}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {completedWorkout.exerciseCount} ćwiczeń
                  </span>
                </div>

                <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Data wykonania
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatISODateToDisplayDate(
                        completedWorkout.completedDate,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Godzina
                    </p>

                    <p className="mt-1 font-semibold">
                      {formatCompletedTime(completedWorkout.completedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Cel
                    </p>

                    <p className="mt-1 font-semibold">
                      {goalLabels[completedWorkout.goal]}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">
                      Status
                    </p>

                    <p className="mt-1 font-semibold text-success">Wykonany</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-center">
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Wróć do dashboardu
        </Link>
      </div>
    </section>
  );
};

export default HistoryPage;
