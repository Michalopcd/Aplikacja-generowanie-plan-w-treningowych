import type { MuscleGroup, WorkoutDay } from "../trainingPlan";

type Props = {
  workoutDay: WorkoutDay;
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

const getMuscleGroupNames = (muscleGroups: MuscleGroup[]): string => {
  return muscleGroups
    .map((muscleGroup) => muscleGroupLabels[muscleGroup])
    .join(", ");
};

export const WorkoutDetailsContent = ({ workoutDay }: Props) => {
  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">
            Szczegóły treningu
          </p>

          <h2 className="mt-2 text-xl font-bold">{workoutDay.name}</h2>
        </div>

        <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {workoutDay.exercises.length} ćwiczeń
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-muted">
        Partie: {getMuscleGroupNames(workoutDay.focusMuscleGroups)}
      </p>

      <div className="mt-4 divide-y divide-border">
        {workoutDay.exercises.map(({ exercise, sets, repsRange }) => (
          <div key={exercise.id} className="py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  {exercise.name}
                </p>

                <p className="mt-1 text-xs text-muted">
                  {getMuscleGroupNames(exercise.muscleGroups)}
                </p>
              </div>

              <span className="shrink-0 text-sm font-semibold text-primary">
                {sets} x {repsRange.min}-{repsRange.max}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
