import type { TrainingProfile } from "../../onboarding/types/onboarding";

import { getAvailableExercises } from "./exerciseSelector";
import { createWorkoutExercise } from "./createWorkoutExercise";

import type {
  Exercise,
  MuscleGroup,
  WorkoutDay,
  WorkoutPlan,
} from "../trainingPlan";

type WorkoutDayDefinition = {
  name: string;
  focusMuscleGroups: MuscleGroup[];
};

type TrainingDaysPerWeek = 2 | 3 | 4 | 5;

const workoutSplits: Record<
  TrainingDaysPerWeek,
  WorkoutDayDefinition[]
> = {
  2: [
    {
      name: "Trening całego ciała A",
      focusMuscleGroups: ["chest", "back", "quadriceps", "glutes", "core"],
    },
    {
      name: "Trening całego ciała B",
      focusMuscleGroups: [
        "shoulders",
        "biceps",
        "triceps",
        "hamstrings",
        "calves",
        "core",
      ],
    },
  ],

  3: [
    {
      name: "Push",
      focusMuscleGroups: ["chest", "shoulders", "triceps"],
    },
    {
      name: "Pull",
      focusMuscleGroups: ["back", "biceps", "core"],
    },
    {
      name: "Legs",
      focusMuscleGroups: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "core",
      ],
    },
  ],

  4: [
    {
      name: "Góra ciała A",
      focusMuscleGroups: ["chest", "back", "shoulders"],
    },
    {
      name: "Dół ciała A",
      focusMuscleGroups: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "core",
      ],
    },
    {
      name: "Góra ciała B",
      focusMuscleGroups: ["chest", "back", "biceps", "triceps"],
    },
    {
      name: "Dół ciała B",
      focusMuscleGroups: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "core",
      ],
    },
  ],

  5: [
    {
      name: "Push",
      focusMuscleGroups: ["chest", "shoulders", "triceps"],
    },
    {
      name: "Pull",
      focusMuscleGroups: ["back", "biceps", "core"],
    },
    {
      name: "Legs",
      focusMuscleGroups: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "core",
      ],
    },
    {
      name: "Góra ciała",
      focusMuscleGroups: ["chest", "back", "shoulders", "biceps", "triceps"],
    },
    {
      name: "Dół ciała",
      focusMuscleGroups: [
        "quadriceps",
        "hamstrings",
        "glutes",
        "calves",
        "core",
      ],
    },
  ],
};

const getWorkoutSplit = (
  trainingDaysPerWeek: number,
): WorkoutDayDefinition[] => {
  if (
    trainingDaysPerWeek < 2 ||
    trainingDaysPerWeek > 5
  ) {
    throw new Error(
      "Generator obsługuje od 2 do 5 dni treningowych.",
    );
  }

  return workoutSplits[trainingDaysPerWeek as TrainingDaysPerWeek];
};

const selectExercisesForDay = (
  availableExercises: Exercise[],
  focusMuscleGroups: MuscleGroup[],
  usedExerciseIds: Set<string>,
): Exercise[] => {
  const selectedExercises: Exercise[] = [];

  for (const muscleGroup of focusMuscleGroups) {
    const exercise = availableExercises.find(
      (item) =>
        item.muscleGroups.includes(muscleGroup) &&
        !usedExerciseIds.has(item.id),
    );

    if (!exercise) {
      continue;
    }

    selectedExercises.push(exercise);
    usedExerciseIds.add(exercise.id);
  }

  return selectedExercises;
};

export const generateWorkoutPlan = (
  trainingProfile: TrainingProfile,
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

      return Number(secondIsSpecificToLocation) - Number(firstIsSpecificToLocation);
    },
  );

  const workoutSplit = getWorkoutSplit(
    trainingProfile.trainingDaysPerWeek,
  );

  const usedExerciseIds = new Set<string>();

  const workoutDays: WorkoutDay[] = workoutSplit.map(
    (day, index) => {
      const selectedExercises = selectExercisesForDay(
        locationPrioritizedExercises,
        day.focusMuscleGroups,
        usedExerciseIds,
      );

      return {
        dayNumber: index + 1,
        name: day.name,
        focusMuscleGroups: day.focusMuscleGroups,
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

  return {
    id: crypto.randomUUID(),
    name: "Wygenerowany plan treningowy",
    goal: trainingProfile.goal,
    trainingLocation: trainingProfile.trainingLocation,
    experienceLevel: trainingProfile.experienceLevel,
    workoutDays,
  };
};