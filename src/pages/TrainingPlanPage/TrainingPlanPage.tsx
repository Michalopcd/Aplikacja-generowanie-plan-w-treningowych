import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";
import { generateWorkoutPlan } from "../../features/training/utils/generateWorkoutPlan";

import type {
  ExperienceLevel,
  TrainingGoal,
  TrainingLocation,
} from "../../features/onboarding/types/onboarding";

import type { MuscleGroup } from "../../features/training/trainingPlan";

import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";

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
const TrainingPlanPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  const plan = useMemo(() => {
    if (!user?.trainingProfile) {
      return null;
    }

    return generateWorkoutPlan(user.trainingProfile);
  }, [user?.trainingProfile]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-card text-white">
        Ładowanie...
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

        <section className="grid gap-5 lg:grid-cols-2">
          {plan.workoutDays.map((workoutDay) => (
            <Card key={workoutDay.dayNumber} className="bg-surface p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-primary">
                    Dzień {workoutDay.dayNumber}
                  </p>

                  <h2 className="mt-1 text-xl font-bold">{workoutDay.name}</h2>
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

              <div className="mt-5 space-y-3">
                {workoutDay.exercises.map(({ exercise, sets, repsRange }) => (
                  <div
                    key={exercise.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold">{exercise.name}</p>

                        <p className="mt-1 text-xs text-muted">
                          {exercise.muscleGroups
                            .map(
                              (muscleGroup) => muscleGroupLabels[muscleGroup],
                            )
                            .join(", ")}
                        </p>
                      </div>

                      <div className="w-fit rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                        {sets} serie x {repsRange.min}-{repsRange.max} powt.
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
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
