import { useEffect } from "react";
import {Link,useNavigate,useParams,} from "react-router-dom";

import {experienceLevelLabels, goalLabels, locationLabels, muscleGroupLabels, weekDayLabels,} from "../../features/training/constants/trainingLabels";
import { useTrainingPlan } from "../../features/training/hooks/useTrainingPlan";
import {formatDateToISO,formatISODateToDisplayDate,getWeekDayFromISODate,} from "../../features/training/utils/dateUtils";
import { getCurrentWorkoutWeekNumber } from "../../features/training/utils/getCurrentWorkoutWeek";
import { createWorkoutKey } from "../../features/training/utils/workoutKey";
import { createWorkoutSchedule } from "../../features/training/utils/workoutSchedule";

import { ROUTES } from "../../utils/route";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { EmptyState } from "../../ui/EmptyState";
import { ErrorState } from "../../ui/ErrorState";
import { LoadingState } from "../../ui/LoadingState";

type GetWorkoutCompletionButtonLabelInput = {
  isSaving: boolean;
  isCompleted: boolean;
  isWorkoutToday: boolean;
};

const getWorkoutCompletionButtonLabel = ({
  isSaving,
  isCompleted,
  isWorkoutToday,
}: GetWorkoutCompletionButtonLabelInput): string => {
  if (isSaving) {
    return "Zapisywanie...";
  }

  if (isCompleted) {
    return "Trening wykonany";
  }

  if (isWorkoutToday) {
    return "Oznacz jako wykonany";
  }

  return "Dostępne w dniu treningu";
};

const TrainingPlanPage = () => {
  const navigate = useNavigate();

  const { weekNumber: weekNumberParam } = useParams<{
    weekNumber: string;
  }>();

  const {
    plan,
    isLoading,
    errorMessage,
    savingWorkoutKey,
    completedWorkoutKeys,
    markWorkoutAsCompleted
  } = useTrainingPlan();

  useEffect(() => {
    if (!plan) {
      return;
    }

    const currentWeekNumber = getCurrentWorkoutWeekNumber(plan);

    const routeWeekNumber = Number(weekNumberParam);

    const isValidWeekNumber =
      Number.isInteger(routeWeekNumber) &&
      routeWeekNumber >= 1 &&
      routeWeekNumber <= plan.durationWeeks;

    if (!weekNumberParam || !isValidWeekNumber) {
      navigate(`${ROUTES.PLAN}/week/${currentWeekNumber}`, {
        replace: true,
      });
    }
  }, [plan, weekNumberParam, navigate]);

  useEffect(() => {
    if (!weekNumberParam || !plan) {
      return;
    }

    const weekElement = document.getElementById(`week-${weekNumberParam}`);

    if (!weekElement) {
      return;
    }

    weekElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [weekNumberParam, plan]);

  if (isLoading) {
    return <LoadingState message="Ładowanie planu treningowego..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (!plan) {
    return (
      <EmptyState
        title="Brak planu treningowego"
        description="Nie znaleziono danych potrzebnych do wyświetlenia planu treningowego."
      />
    );
  }

  const today = formatDateToISO(new Date());

  const workoutSchedule = createWorkoutSchedule(plan);

  const selectedWeekNumber = Number(weekNumberParam);

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-sm font-semibold text-primary">Mój plan</p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Twój plan treningowy
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Plan został wygenerowany na podstawie danych z onboardingu: celu,
          miejsca treningu, poziomu zaawansowania i liczby dni treningowych.
        </p>
      </div>

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="bg-surface">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Cel
          </p>

          <p className="mt-2 text-lg font-semibold">{goalLabels[plan.goal]}</p>
        </Card>

        <Card className="bg-surface">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Miejsce
          </p>

          <p className="mt-2 text-lg font-semibold">
            {locationLabels[plan.trainingLocation]}
          </p>
        </Card>

        <Card className="bg-surface">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Poziom
          </p>

          <p className="mt-2 text-lg font-semibold">
            {experienceLevelLabels[plan.experienceLevel]}
          </p>
        </Card>

        <Card className="bg-surface">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Treningi tygodniowo
          </p>

          <p className="mt-2 text-lg font-semibold">
            {plan.workoutDays.length} dni
          </p>
        </Card>
      </section>

      <section className="space-y-6">
        {workoutSchedule.map((scheduleWeek) => {
          const isWeekExpanded = selectedWeekNumber === scheduleWeek.weekNumber;

          return (
            <Card
              id={`week-${scheduleWeek.weekNumber}`}
              key={scheduleWeek.weekNumber}
              className="bg-surface p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Tydzień {scheduleWeek.weekNumber}
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    {formatISODateToDisplayDate(scheduleWeek.weekStartDate)} -{" "}
                    {formatISODateToDisplayDate(scheduleWeek.weekEndDate)}
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    Liczba treningów: {scheduleWeek.workouts.length}
                  </p>
                </div>

                {isWeekExpanded ? (
                  <span className="w-fit rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                    Wybrany tydzień
                  </span>
                ) : (
                  <Link
                    to={`${ROUTES.PLAN}/week/${scheduleWeek.weekNumber}`}
                    className="inline-flex w-fit items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Rozwiń tydzień
                  </Link>
                )}
              </div>

              {isWeekExpanded && (
                <>
                  {scheduleWeek.workouts.length === 0 ? (
                    <div className="mt-5">
                      <EmptyState
                        title="Brak treningów w tym tygodniu"
                        description="W tym tygodniu nie masz zaplanowanych treningów."
                      />
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-5 lg:grid-cols-2">
                      {scheduleWeek.workouts.map((scheduledWorkout) => {
                        const { workoutDay } = scheduledWorkout;

                        const workoutKey = createWorkoutKey(
                          scheduledWorkout.scheduledDate,
                          workoutDay.dayNumber,
                        );

                        const isSaving = savingWorkoutKey === workoutKey;

                        const isWorkoutToday =
                          scheduledWorkout.scheduledDate === today;

                        const isCompleted =
                          completedWorkoutKeys.has(workoutKey);

                        return (
                          <Card
                            key={`${scheduledWorkout.scheduledDate}-${workoutDay.dayNumber}`}
                            className="bg-card p-5"
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-sm font-semibold text-primary">
                                  Trening {scheduledWorkout.trainingNumber}
                                </p>

                                <h3 className="mt-1 text-xl font-bold">
                                  {workoutDay.name}
                                </h3>

                                <p className="mt-2 text-sm text-muted">
                                  {
                                    weekDayLabels[
                                      getWeekDayFromISODate(
                                        scheduledWorkout.scheduledDate,
                                      )
                                    ]
                                  }
                                  ,{" "}
                                  {formatISODateToDisplayDate(
                                    scheduledWorkout.scheduledDate,
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

                            <div className="mt-5 space-y-3">
                              {workoutDay.exercises.map(
                                ({ exercise, sets, repsRange }) => (
                                  <div
                                    key={exercise.id}
                                    className="rounded-xl border border-border bg-surface p-4"
                                  >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                      <div>
                                        <p className="font-semibold">
                                          {exercise.name}
                                        </p>

                                        <p className="mt-1 text-xs text-muted">
                                          {exercise.muscleGroups
                                            .map(
                                              (muscleGroup) =>
                                                muscleGroupLabels[muscleGroup],
                                            )
                                            .join(", ")}
                                        </p>
                                      </div>

                                      <div className="w-fit rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                                        {sets} serie x {repsRange.min}-
                                        {repsRange.max} powt.
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>

                            <div className="mt-6 flex border-t border-border pt-4 sm:justify-end">
                              <Button
                                onClick={() =>
                                  markWorkoutAsCompleted(scheduledWorkout)
                                }
                                disabled={
                                  !isWorkoutToday || isSaving || isCompleted
                                }
                                className="w-full sm:w-auto"
                              >
                                {getWorkoutCompletionButtonLabel({
                                  isSaving,
                                  isCompleted,
                                  isWorkoutToday,
                                })}
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </Card>
          );
        })}
      </section>

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

export default TrainingPlanPage;
