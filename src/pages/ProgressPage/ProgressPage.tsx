import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import {
  experienceLevelLabels,
  goalLabels,
  locationLabels,
} from "../../features/training/constants/trainingLabels";
import type { CompletedWorkout } from "../../features/training/completedWorkout";
import { getCompletedWorkoutsForPlan } from "../../features/training/service/completedWorkoutService";
import {
  ActiveWorkoutPlanNotFoundError,
  getActiveWorkoutPlan,
} from "../../features/training/service/workoutPlanService";
import type { WorkoutPlan } from "../../features/training/trainingPlan";
import {
  formatDateToISO,
  formatISODateToDisplayDate,
} from "../../features/training/utils/dateUtils";
import { createProgressStats } from "../../features/training/utils/progressStats";
import {
  createWorkoutSchedule,
  type WorkoutScheduleWeek,
} from "../../features/training/utils/workoutSchedule";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

const ProgressPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);
  const [workoutSchedule, setWorkoutSchedule] = useState<
    WorkoutScheduleWeek[]
  >([]);
  const [isProgressLoading, setIsProgressLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user?.uid) {
        setIsProgressLoading(false);
        return;
      }

      setIsProgressLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        const userCompletedWorkouts = await getCompletedWorkoutsForPlan(
          user.uid,
          activePlan.id,
        );

        const schedule = createWorkoutSchedule(activePlan);

        setPlan(activePlan);
        setCompletedWorkouts(userCompletedWorkouts);
        setWorkoutSchedule(schedule);
      } catch (error) {
        if (error instanceof ActiveWorkoutPlanNotFoundError) {
          setPlan(null);
          return;
        }

        setErrorMessage("Nie udało się pobrać statystyk postępów.");
      } finally {
        setIsProgressLoading(false);
      }
    };

    loadProgressData();
  }, [user?.uid]);

  if (isLoading || isProgressLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-white">
        Ładowanie postępów...
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
            <h1 className="text-2xl font-bold">Postępy</h1>

            <p className="mt-3 text-muted">
              Nie znaleziono aktywnego planu treningowego. Wygeneruj plan,
              aby móc śledzić postępy.
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

  const today = formatDateToISO(new Date());

  const currentWeek = workoutSchedule.find(
    (scheduleWeek) =>
      today >= scheduleWeek.weekStartDate &&
      today <= scheduleWeek.weekEndDate,
  );

  const progressStats = createProgressStats({
    workoutSchedule,
    completedWorkouts,
    currentWeekNumber: currentWeek?.weekNumber ?? null,
  });

  return (
    <main className="min-h-screen bg-card p-4 text-white md:p-6 xl:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">
            Twoje postępy
          </p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Statystyki planu treningowego
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Tutaj możesz sprawdzić, ile treningów zostało zaplanowanych,
            ile zostało wykonanych oraz jaki procent planu jest już
            ukończony.
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
                <p className="mt-1 font-semibold">
                  {goalLabels[plan.goal]}
                </p>
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
                <p className="text-sm text-muted">
                  Treningi tygodniowo
                </p>
                <p className="mt-1 font-semibold">
                  {plan.workoutDays.length} dni
                </p>
              </div>

              <div>
                <p className="text-sm text-muted">Czas trwania</p>
                <p className="mt-1 font-semibold">
                  {plan.durationWeeks} tygodni
                </p>
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
              <p className="mt-5 text-muted">
                Aktualna data nie znajduje się w zakresie planu.
              </p>
            )}
          </Card>
        </section>

        <Card className="bg-surface p-6">
          <h2 className="text-xl font-bold">Ostatnio wykonane treningi</h2>

          {completedWorkouts.length === 0 ? (
            <p className="mt-4 text-muted">
              Nie masz jeszcze żadnych wykonanych treningów. Oznacz
              trening jako wykonany w zakładce „Mój plan”, aby zobaczyć
              tutaj historię.
            </p>
          ) : (
            <div className="mt-5 space-y-3">
              {completedWorkouts
                .slice()
                .sort(
                  (firstWorkout, secondWorkout) =>
                    secondWorkout.completedAt.getTime() -
                    firstWorkout.completedAt.getTime(),
                )
                .slice(0, 5)
                .map((completedWorkout) => (
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

export default ProgressPage;