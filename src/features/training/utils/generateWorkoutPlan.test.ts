import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  ExperienceLevel,
  TrainingProfile,
} from "../../onboarding/types/onboarding";
import type { Exercise, MuscleGroup } from "../trainingPlan";
import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";

import { createWorkoutExercise } from "./createWorkoutExercise";
import { formatDateToISO, getMondayOfWeek } from "./dateUtils";
import { getAvailableExercises } from "./exerciseSelector";
import { generateWorkoutPlan } from "./generateWorkoutPlan";
import { selectExercisesForDay } from "./selectExercisesForDay";

vi.mock("./createWorkoutExercise", () => ({
  createWorkoutExercise: vi.fn(),
}));

vi.mock("./dateUtils", () => ({
  formatDateToISO: vi.fn(),
  getMondayOfWeek: vi.fn(),
}));

vi.mock("./exerciseSelector", () => ({
  getAvailableExercises: vi.fn(),
}));

vi.mock("./selectExercisesForDay", () => ({
  selectExercisesForDay: vi.fn(),
}));

const mockedCreateWorkoutExercise = vi.mocked(createWorkoutExercise);

const mockedFormatDateToISO = vi.mocked(formatDateToISO);

const mockedGetMondayOfWeek = vi.mocked(getMondayOfWeek);

const mockedGetAvailableExercises = vi.mocked(getAvailableExercises);

const mockedSelectExercisesForDay = vi.mocked(selectExercisesForDay);

const NOW = new Date(2026, 9, 8, 12);
const MONDAY = new Date(2026, 9, 5, 12);

const createTrainingProfile = (
  overrides: Partial<TrainingProfile> = {},
): TrainingProfile => {
  return {
    age: 25,
    height: 180,
    weight: 80,
    gender: "male",
    experienceLevel: "beginner",
    goal: "mass",
    trainingDaysPerWeek: 3,
    trainingLocation: "gym",
    ...overrides,
  };
};

const createExercise = (
  id: string,
  overrides: Partial<Exercise> = {},
): Exercise => {
  return {
    id,
    name: `Exercise ${id}`,
    trainingLocations: ["gym"],
    muscleGroups: ["chest"],
    experienceLevels: ["beginner", "intermediate", "advanced"],
    ...overrides,
  };
};

const createExercises = (count: number): Exercise[] => {
  return Array.from({ length: count }, (_, index) =>
    createExercise(`exercise-${index + 1}`),
  );
};

const createWorkoutPlanTemplate = (
  focusMuscleGroups: MuscleGroup[] = ["chest"],
): WorkoutPlanTemplate => {
  return {
    id: "template-1",
    trainingDaysPerWeek: 3,
    isActive: true,
    workoutDays: [
      {
        dayNumber: 1,
        weekDay: "monday",
        name: "Workout A",
        focusMuscleGroups,
      },
    ],
  } as WorkoutPlanTemplate;
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(NOW);

  vi.clearAllMocks();

  mockedGetMondayOfWeek.mockReturnValue(MONDAY);

  mockedFormatDateToISO.mockReturnValue("2026-10-05");

  mockedCreateWorkoutExercise.mockImplementation(
    (exercise) =>
      ({
        exercise,
      }) as ReturnType<typeof createWorkoutExercise>,
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe("generateWorkoutPlan", () => {
  it("creates an active 12-week workout plan for the user", () => {
    const exercises = createExercises(3);

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockReturnValue(exercises);

    const result = generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      exercises,
    );

    expect(result).toMatchObject({
      uid: "user-1",
      name: "Wygenerowany plan treningowy",
      startDate: "2026-10-05",
      durationWeeks: 12,
      goal: "mass",
      trainingLocation: "gym",
      experienceLevel: "beginner",
      status: "active",
    });

    expect(result.createdAt).toEqual(NOW);
    expect(result.updatedAt).toEqual(NOW);

    expect(result.id).toEqual(expect.any(String));
  });

  it("passes profile data to getAvailableExercises", () => {
    const exercises = createExercises(3);

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockReturnValue(exercises);

    generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      exercises,
    );

    expect(mockedGetAvailableExercises).toHaveBeenCalledWith(
      exercises,
      "gym",
      "beginner",
    );
  });

  it.each([
    ["beginner", 3],
    ["intermediate", 4],
    ["advanced", 5],
  ] as const)(
    "requests %i exercises for %s level",
    (experienceLevel: ExperienceLevel, expectedExerciseCount) => {
      const exercises = createExercises(5);

      mockedGetAvailableExercises.mockReturnValue(exercises);

      mockedSelectExercisesForDay.mockReturnValue(
        exercises.slice(0, expectedExerciseCount),
      );

      generateWorkoutPlan(
        "user-1",
        createTrainingProfile({
          experienceLevel,
        }),
        createWorkoutPlanTemplate(),
        exercises,
      );

      expect(mockedSelectExercisesForDay).toHaveBeenCalledWith(
        expect.any(Array),
        ["chest"],
        expectedExerciseCount,
      );
    },
  );

  it("uses workout day data from the template", () => {
    const exercises = createExercises(3);

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockReturnValue(exercises);

    const template = createWorkoutPlanTemplate(["chest", "triceps"]);

    const result = generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      template,
      exercises,
    );

    expect(result.workoutDays[0]).toMatchObject({
      dayNumber: 1,
      weekDay: "monday",
      name: "Workout A",
      focusMuscleGroups: ["chest", "triceps"],
    });
  });

  it("prioritizes exercises specific to the selected training location", () => {
    const sharedExercise = createExercise("shared", {
      trainingLocations: ["home", "gym"],
    });

    const gymExercise1 = createExercise("gym-1");

    const gymExercise2 = createExercise("gym-2");

    const exercises = [sharedExercise, gymExercise1, gymExercise2];

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockReturnValue(exercises);

    generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      exercises,
    );

    expect(mockedSelectExercisesForDay).toHaveBeenCalledWith(
      [gymExercise1, gymExercise2, sharedExercise],
      ["chest"],
      3,
    );
  });

  it("creates workout exercises from selected exercises", () => {
    const exercises = createExercises(3);

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockReturnValue(exercises);

    generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      exercises,
    );

    expect(mockedCreateWorkoutExercise).toHaveBeenCalledTimes(3);

    expect(mockedCreateWorkoutExercise).toHaveBeenNthCalledWith(
      1,
      exercises[0],
      "mass",
      "beginner",
    );

    expect(mockedCreateWorkoutExercise).toHaveBeenNthCalledWith(
      2,
      exercises[1],
      "mass",
      "beginner",
    );

    expect(mockedCreateWorkoutExercise).toHaveBeenNthCalledWith(
      3,
      exercises[2],
      "mass",
      "beginner",
    );
  });

  it("uses date utilities to create the start date", () => {
    const exercises = createExercises(3);

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockReturnValue(exercises);

    generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      exercises,
    );

    expect(mockedGetMondayOfWeek).toHaveBeenCalledWith(NOW);

    expect(mockedFormatDateToISO).toHaveBeenCalledWith(MONDAY);
  });

  it("propagates an error when exercises cannot be selected", () => {
    const exercises = createExercises(3);

    mockedGetAvailableExercises.mockReturnValue(exercises);

    mockedSelectExercisesForDay.mockImplementation(() => {
      throw new Error(
        "Brak wystarczającej liczby ćwiczeń do wygenerowania treningu.",
      );
    });

    expect(() =>
      generateWorkoutPlan(
        "user-1",
        createTrainingProfile(),
        createWorkoutPlanTemplate(),
        exercises,
      ),
    ).toThrow("Brak wystarczającej liczby ćwiczeń do wygenerowania treningu.");
  });
});
