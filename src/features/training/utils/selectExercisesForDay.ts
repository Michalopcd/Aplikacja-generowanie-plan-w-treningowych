import type { Exercise, MuscleGroup } from "../trainingPlan";

export const selectExercisesForDay = (
  availableExercises: Exercise[],
  focusMuscleGroups: MuscleGroup[],
  exercisesCount: number,
): Exercise[] => {
  const matchingExercises = availableExercises.filter((exercise) =>
    exercise.muscleGroups.some((muscleGroup) =>
      focusMuscleGroups.includes(muscleGroup),
    ),
  );

  if (matchingExercises.length < exercisesCount) {
    throw new Error(
      "Brak wystarczającej liczby ćwiczeń do wygenerowania treningu.",
    );
  }

  const selectedExercises: Exercise[] = [];
  const selectedExerciseIds = new Set<string>();

  for (const muscleGroup of focusMuscleGroups) {
    if (selectedExercises.length >= exercisesCount) {
      break;
    }

    const exercise = matchingExercises.find(
      (item) =>
        item.muscleGroups.includes(muscleGroup) &&
        !selectedExerciseIds.has(item.id),
    );

    if (!exercise) {
      continue;
    }

    selectedExercises.push(exercise);
    selectedExerciseIds.add(exercise.id);
  }

  for (const exercise of matchingExercises) {
    if (selectedExercises.length >= exercisesCount) {
      break;
    }

    if (selectedExerciseIds.has(exercise.id)) {
      continue;
    }

    selectedExercises.push(exercise);
    selectedExerciseIds.add(exercise.id);
  }

  return selectedExercises;
};
