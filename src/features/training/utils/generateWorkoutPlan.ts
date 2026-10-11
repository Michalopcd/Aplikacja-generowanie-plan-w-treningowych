import type {
  ExperienceLevel,
  TrainingProfile,
} from "../../onboarding/types/onboarding";

import type {
  Exercise,
  MuscleGroup,
  WorkoutDay,
  WorkoutPlan,
} from "../trainingPlan";
import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";

import { createWorkoutExercise } from "./createWorkoutExercise";
import { formatDateToISO, getMondayOfWeek } from "./dateUtils";
import { getAvailableExercises } from "./exerciseSelector";

const exercisesPerWorkoutByLevel: Record<ExperienceLevel, number> = {
  beginner: 3,
  intermediate: 4,
  advanced: 5,
};

const getWorkoutPlanStartDate = (date: Date): Date => {
  const monday = getMondayOfWeek(date);

  const isWeekend = date.getDay() === 0 || date.getDay() === 6;

  if (!isWeekend) {
    return monday;
  }

  const nextMonday = new Date(monday);

  nextMonday.setDate(nextMonday.getDate() + 7);

  return nextMonday;
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
  exercises: Exercise[],
): WorkoutPlan => {
  const availableExercises = getAvailableExercises(
    exercises,
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

  const startDate = getWorkoutPlanStartDate(now);

  return {
    id: crypto.randomUUID(),

    uid,

    name: "Wygenerowany plan treningowy",

    startDate: formatDateToISO(startDate),

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
