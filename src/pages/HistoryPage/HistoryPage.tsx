import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import {
  goalLabels,
} from "../../features/training/constants/trainingLabels";
import type { CompletedWorkout } from "../../features/training/completedWorkout";
import { getCompletedWorkoutsForPlan } from "../../features/training/service/completedWorkoutService";
import {
  ActiveWorkoutPlanNotFoundError,
  getActiveWorkoutPlan,
} from "../../features/training/service/workoutPlanService";
import type { WorkoutPlan } from "../../features/training/trainingPlan";
import { formatISODateToDisplayDate } from "../../features/training/utils/dateUtils";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

const formatCompletedTime = (date: Date): string => {
  return date.toLocaleTimeString("pl-PL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const HistoryPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadWorkoutHistory = async () => {
      if (!user?.uid) {
        setIsHistoryLoading(false);
        return;
      }

      setIsHistoryLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        const userCompletedWorkouts = await getCompletedWorkoutsForPlan(
          user.uid,
          activePlan.id,
        );

        const sortedCompletedWorkouts = userCompletedWorkouts
          .slice()
          .sort(
            (firstWorkout, secondWorkout) =>
              secondWorkout.completedAt.getTime() -
              firstWorkout.completedAt.getTime(),
          );

        setPlan(activePlan);
        setCompletedWorkouts(sortedCompletedWorkouts);
      } catch (error) {
        if (error instanceof ActiveWorkoutPlanNotFoundError) {
          setPlan(null);
          return;
        }

        setErrorMessage("Nie udało się pobrać historii treningów.");
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadWorkoutHistory();
  }, [user?.uid]);

  if (isLoading || isHistoryLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-white">
        Ładowanie historii treningów...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card px-4 text-center text-white">
        {errorMessage}
      </div>
    );
  }

  if (!plan) {
    return (
      <main className="min-h-screen bg-card p-4 text-white md:p-6 xl:p-8">
        <div className="mx-auto w-full max-w-5xl">
          <Card className="bg-surface p-6">
            <h1 className="text-2xl font-bold">Historia treningów</h1>

            <p className="mt-3 text-muted">
              Nie znaleziono aktywnego planu treningowego. Wygeneruj plan,
              aby móc zapisywać i przeglądać historię treningów.
            </p>

            <div className="mt-6">
              <Button onClick={() => navigate("/plan")}>
                Przejdź do planu
              </Button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-card p-4 text-white md:p-6 xl:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">
            Historia aktywności
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Historia wykonanych treningów
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Tutaj znajdziesz listę treningów oznaczonych jako wykonane w
            ramach aktualnego planu treningowego.
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

            <p className="mt-2 text-3xl font-bold">
              {completedWorkouts.length}
            </p>
          </Card>

          <Card className="bg-surface p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Cel planu
            </p>

            <p className="mt-2 text-lg font-semibold">
              {goalLabels[plan.goal]}
            </p>
          </Card>
        </section>

        <Card className="bg-surface p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">
                Lista wykonanych treningów
              </h2>

              <p className="mt-1 text-sm text-muted">
                Najnowsze treningi są wyświetlane na górze listy.
              </p>
            </div>

            <Button onClick={() => navigate("/plan")}>
              Przejdź do planu
            </Button>
          </div>

          {completedWorkouts.length === 0 ? (
            <p className="mt-6 rounded-xl border border-border bg-card p-5 text-muted">
              Nie masz jeszcze żadnych wykonanych treningów. Wejdź w
              zakładkę „Mój plan” i oznacz dzisiejszy trening jako
              wykonany.
            </p>
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

                      <p className="mt-2 text-sm text-muted">
                        Tydzień {completedWorkout.weekNumber} • zaplanowany
                        na{" "}
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
                        {formatCompletedTime(
                          completedWorkout.completedAt,
                        )}
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

                      <p className="mt-1 font-semibold text-success">
                        Wykonany
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 font-semibold"
          >
            Wróć do dashboardu
          </Button>
        </div>
      </div>
    </main>
  );
};

export default HistoryPage;