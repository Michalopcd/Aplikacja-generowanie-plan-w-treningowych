import type { TrainingProfile } from "../../onboarding/types/onboarding";
import { getAvailableExercises } from "./exerciseSelector";
import { createWorkoutExercise } from "./createWorkoutExercise";
import { formatDateToISO, getMondayOfWeek } from "./dateUtils";
import type {
  Exercise,
  MuscleGroup,
  WeekDay,
  WorkoutDay,
  WorkoutPlan,
} from "../trainingPlan";

type WorkoutDayDefinition = {
  weekDay: WeekDay;
  name: string;
  focusMuscleGroups: MuscleGroup[];
};

type TrainingDaysPerWeek = 2 | 3 | 4 | 5;

const workoutSplits: Record<TrainingDaysPerWeek, WorkoutDayDefinition[]> = {
  2: [
    {
      weekDay: "monday",
      name: "Trening całego ciała A",
      focusMuscleGroups: ["chest", "back", "quadriceps", "glutes", "core"],
    },
    {
      weekDay: "thursday",
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
      weekDay: "monday",
      name: "Push",
      focusMuscleGroups: ["chest", "shoulders", "triceps"],
    },
    {
      weekDay: "wednesday",
      name: "Pull",
      focusMuscleGroups: ["back", "biceps", "core"],
    },
    {
      weekDay: "friday",
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
      weekDay: "monday",
      name: "Góra ciała A",
      focusMuscleGroups: ["chest", "back", "shoulders"],
    },
    {
      weekDay: "tuesday",
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
      weekDay: "thursday",
      name: "Góra ciała B",
      focusMuscleGroups: ["chest", "back", "biceps", "triceps"],
    },
    {
      weekDay: "friday",
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
      weekDay: "monday",
      name: "Push",
      focusMuscleGroups: ["chest", "shoulders", "triceps"],
    },
    {
      weekDay: "tuesday",
      name: "Pull",
      focusMuscleGroups: ["back", "biceps", "core"],
    },
    {
      weekDay: "wednesday",
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
      weekDay: "thursday",
      name: "Góra ciała",
      focusMuscleGroups: ["chest", "back", "shoulders", "biceps", "triceps"],
    },
    {
      weekDay: "friday",
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
  if (trainingDaysPerWeek < 2 || trainingDaysPerWeek > 5) {
    throw new Error("Generator obsługuje od 2 do 5 dni treningowych.");
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
  uid: string,
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

      return (
        Number(secondIsSpecificToLocation) -
        Number(firstIsSpecificToLocation)
      );
    },
  );

  const workoutSplit = getWorkoutSplit(trainingProfile.trainingDaysPerWeek);
  const usedExerciseIds = new Set<string>();

  const workoutDays: WorkoutDay[] = workoutSplit.map((day, index) => {
    const selectedExercises = selectExercisesForDay(
      locationPrioritizedExercises,
      day.focusMuscleGroups,
      usedExerciseIds,
    );

    return {
      dayNumber: index + 1,
      weekDay: day.weekDay,
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
  });

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