import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../features/auth/AuthContext";
import type {
  ExperienceLevel,
  TrainingGoal,
  TrainingLocation,
} from "../../features/onboarding/types/onboarding";
import {
  saveCompletedWorkout,
  getCompletedWorkoutsForPlan,
} from "../../features/training/service/completedWorkoutService";
import {
  ActiveWorkoutPlanNotFoundError,
  getActiveWorkoutPlan,
  saveWorkoutPlan,
} from "../../features/training/service/workoutPlanService";
import type {
  MuscleGroup,
  WeekDay,
  WorkoutPlan,
} from "../../features/training/trainingPlan";
import { formatDateToISO } from "../../features/training/utils/dateUtils";
import { generateWorkoutPlan } from "../../features/training/utils/generateWorkoutPlan";
import {
  createWorkoutSchedule,
  type ScheduledWorkout,
} from "../../features/training/utils/workoutSchdule";

import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";

const goalLabels: Record<TrainingGoal, string> = {
  reduction: "Redukcja",
  recomposition: "Rekompozycja",
  mass: "Budowanie masy",
};

const locationLabels: Record<TrainingLocation, string> = {
  home: "Dom",
  gym: "Siłownia",
};

const experienceLevelLabels: Record<ExperienceLevel, string> = {
  beginner: "Początkujący",
  intermediate: "Średniozaawansowany",
  advanced: "Zaawansowany",
};

const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: "Klatka",
  back: "Plecy",
  shoulders: "Barki",
  biceps: "Biceps",
  triceps: "Triceps",
  quadriceps: "Czworogłowe uda",
  hamstrings: "Dwugłowe uda",
  glutes: "Pośladki",
  calves: "Łydki",
  core: "Brzuch",
};

const weekDayLabels: Record<WeekDay, string> = {
  monday: "Poniedziałek",
  tuesday: "Wtorek",
  wednesday: "Środa",
  thursday: "Czwartek",
  friday: "Piątek",
  saturday: "Sobota",
  sunday: "Niedziela",
};

const formatDisplayDate = (date: string): string => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day).toLocaleDateString("pl-PL");
};

const createWorkoutKey = (
  scheduledDate: string,
  workoutDayNumber: number,
): string => {
  return `${scheduledDate}_${workoutDayNumber}`;
};

const TrainingPlanPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isPlanLoading, setIsPlanLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [savingWorkoutKey, setSavingWorkoutKey] = useState<string | null>(null);
  const [completedWorkoutKeys, setCompletedWorkoutKeys] = useState<Set<string>>(
    new Set(),
  );
 const [expandedWeekNumbers, setExpandedWeekNumbers] = useState<
  Set<number>
>(new Set());

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      if (!user?.uid || !user.trainingProfile) {
        setIsPlanLoading(false);
        return;
      }

      setIsPlanLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        const completedWorkouts = await getCompletedWorkoutsForPlan(
          user.uid,
          activePlan.id,
        );

        setCompletedWorkoutKeys(
          new Set(
            completedWorkouts.map((completedWorkout) =>
              createWorkoutKey(
                completedWorkout.scheduledDate,
                completedWorkout.workoutDayNumber,
              ),
            ),
          ),
        );

        setPlan(activePlan);
      } catch (error) {
        if (error instanceof ActiveWorkoutPlanNotFoundError) {
          const newPlan = generateWorkoutPlan(user.uid, user.trainingProfile);

          await saveWorkoutPlan(newPlan);
          setCompletedWorkoutKeys(new Set());
          setPlan(newPlan);
          return;
        }

        setErrorMessage(
          "Nie udało się pobrać albo zapisać planu treningowego.",
        );
      } finally {
        setIsPlanLoading(false);
      }
    };

    loadWorkoutPlan();
  }, [user?.uid, user?.trainingProfile]);
  useEffect(() => {
  if (!plan) {
    return;
  }

  const today = formatDateToISO(new Date());
  const workoutSchedule = createWorkoutSchedule(plan);

  const currentWeek = workoutSchedule.find(
    (scheduleWeek) =>
      today >= scheduleWeek.weekStartDate &&
      today <= scheduleWeek.weekEndDate,
  );

  setExpandedWeekNumbers(new Set([currentWeek?.weekNumber ?? 1]));
}, [plan]);

  if (isLoading || isPlanLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-white">
        Ładowanie...
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
      <div className="flex min-h-screen items-center justify-center bg-card text-white">
        Brak danych treningowych użytkownika.
      </div>
    );
  }

  const today = formatDateToISO(new Date());
  const workoutSchedule = createWorkoutSchedule(plan);

  const handleMarkWorkoutAsCompleted = async (
    scheduledWorkout: ScheduledWorkout,
  ) => {
    const { workoutDay } = scheduledWorkout;

    if (!user?.uid) {
      return;
    }

    if (scheduledWorkout.scheduledDate !== today) {
      toast.info("Możesz oznaczyć tylko dzisiejszy trening.");
      return;
    }

    const savingKey = createWorkoutKey(
      scheduledWorkout.scheduledDate,
      workoutDay.dayNumber,
    );

    setSavingWorkoutKey(savingKey);

    try {
      await saveCompletedWorkout({
        uid: user.uid,
        workoutPlanId: plan.id,
        workoutDayNumber: workoutDay.dayNumber,
        workoutDayName: workoutDay.name,
        weekNumber: scheduledWorkout.weekNumber,
        trainingNumber: scheduledWorkout.trainingNumber,
        scheduledDate: scheduledWorkout.scheduledDate,
        goal: plan.goal,
        exerciseCount: workoutDay.exercises.length,
      });
      setCompletedWorkoutKeys((currentCompletedWorkoutKeys) => {
        const updatedCompletedWorkoutKeys = new Set(
          currentCompletedWorkoutKeys,
        );

        updatedCompletedWorkoutKeys.add(savingKey);

        return updatedCompletedWorkoutKeys;
      });

      toast.success("Trening został oznaczony jako wykonany.");
    } catch (error) {
      console.error(error);
      toast.error("Nie udało się oznaczyć treningu jako wykonanego.");
    } finally {
      setSavingWorkoutKey(null);
    }
  };
const handleToggleWeek = (weekNumber: number) => {
  setExpandedWeekNumbers((currentExpandedWeekNumbers) => {
    const updatedExpandedWeekNumbers = new Set(
      currentExpandedWeekNumbers,
    );

    if (updatedExpandedWeekNumbers.has(weekNumber)) {
      updatedExpandedWeekNumbers.delete(weekNumber);
    } else {
      updatedExpandedWeekNumbers.add(weekNumber);
    }

    return updatedExpandedWeekNumbers;
  });
};
  return (
    <main className="min-h-screen bg-card p-4 text-white md:p-6 xl:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6">
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

            <p className="mt-2 text-lg font-semibold">
              {goalLabels[plan.goal]}
            </p>
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

        <section className="space-y-8">
          {workoutSchedule.map((scheduleWeek) => {
    const isWeekExpanded = expandedWeekNumbers.has(
      scheduleWeek.weekNumber,
    );

    return (
      <Card
        key={scheduleWeek.weekNumber}
        className="bg-surface p-5"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">
              Tydzień {scheduleWeek.weekNumber}
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {formatDisplayDate(scheduleWeek.weekStartDate)} -{" "}
              {formatDisplayDate(scheduleWeek.weekEndDate)}
            </h2>

            <p className="mt-1 text-sm text-muted">
              Liczba treningów: {scheduleWeek.workouts.length}
            </p>
          </div>

          <Button
            type="button"
            onClick={() => handleToggleWeek(scheduleWeek.weekNumber)}
          >
            {isWeekExpanded ? "Zwiń tydzień" : "Rozwiń tydzień"}
          </Button>
        </div>

        {isWeekExpanded && (
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
                        {weekDayLabels[workoutDay.weekDay]},{" "}
                        {formatDisplayDate(
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

                  <div className="mt-6 flex justify-end border-t border-border pt-4">
                    <Button
                      onClick={() =>
                        handleMarkWorkoutAsCompleted(
                          scheduledWorkout,
                        )
                      }
                      disabled={!isWorkoutToday || isSaving || isCompleted}
                    >
                      {isSaving
                        ? "Zapisywanie..."
                        : isCompleted
                          ? "Trening wykonany"
                          : isWorkoutToday
                            ? "Oznacz jako wykonany"
                            : "Dostępne w dniu treningu"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    );
  })}
        </section>

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

export default TrainingPlanPage;
