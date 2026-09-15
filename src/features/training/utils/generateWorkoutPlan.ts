import type {
  ExperienceLevel,
  TrainingProfile,
} from "../../onboarding/types/onboarding";

import { createWorkoutExercise } from "./createWorkoutExercise";
import { formatDateToISO, getMondayOfWeek } from "./dateUtils";

import { getAvailableExercises } from "./exerciseSelector";

import type {
  Exercise,
  MuscleGroup,
  WorkoutDay,
  WorkoutPlan,
} from "../trainingPlan";

import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";

const exercisesPerWorkoutByLevel: Record<ExperienceLevel, number> = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
};

const selectExercisesForDay = (
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

export const generateWorkoutPlan = (
  uid: string,
  trainingProfile: TrainingProfile,
  workoutPlanTemplate: WorkoutPlanTemplate,
): WorkoutPlan => {
  const availableExercises = getAvailableExercises(
    trainingProfile.trainingLocation,
    trainingProfile.experienceLevel,
  );

  const locationPrioritizedExercises = [...availableExercises].sort(
    (firstExercise, secondExercise) => {
      const firstIsSpecificToLocation =
        firstExercise.trainingLocations.length === 1;

      const secondIsSpecificToLocation =
        secondExercise.trainingLocations.length === 1;

      return (
        Number(secondIsSpecificToLocation) - Number(firstIsSpecificToLocation)
      );
    },
  );

  const exercisesPerWorkout =
    exercisesPerWorkoutByLevel[trainingProfile.experienceLevel];

  const workoutDays: WorkoutDay[] = workoutPlanTemplate.workoutDays.map(
    (workoutDayTemplate) => {
      const selectedExercises = selectExercisesForDay(
        locationPrioritizedExercises,
        workoutDayTemplate.focusMuscleGroups,
        exercisesPerWorkout,
      );

      return {
        dayNumber: workoutDayTemplate.dayNumber,

        weekDay: workoutDayTemplate.weekDay,

        name: workoutDayTemplate.name,

        focusMuscleGroups: workoutDayTemplate.focusMuscleGroups,

        exercises: selectedExercises.map((exercise) =>
          createWorkoutExercise(
            exercise,
            trainingProfile.goal,
            trainingProfile.experienceLevel,
          ),
        ),
      };
    },
  );

  const now = new Date();

  return {
    id: crypto.randomUUID(),
    uid,
    name: "Wygenerowany plan treningowy",
    startDate: formatDateToISO(getMondayOfWeek(now)),
    durationWeeks: 12,
    goal: trainingProfile.goal,
    trainingLocation: trainingProfile.trainingLocation,
    experienceLevel: trainingProfile.experienceLevel,
    workoutDays,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
};
