import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  ExperienceLevel,
  TrainingProfile,
} from "../../onboarding/types/onboarding";
import type {
  Exercise,
  MuscleGroup,
} from "../trainingPlan";
import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";

import { generateWorkoutPlan } from "./generateWorkoutPlan";

const NOW = new Date(2026, 9, 8, 12);

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
    experienceLevels: [
      "beginner",
      "intermediate",
      "advanced",
    ],
    ...overrides,
  };
};

const createExercises = (
  count: number,
  overrides: Partial<Exercise> = {},
): Exercise[] => {
  return Array.from(
    { length: count },
    (_, index) =>
      createExercise(
        `exercise-${index + 1}`,
        overrides,
      ),
  );
};

const createWorkoutPlanTemplate = (
  focusMuscleGroups: MuscleGroup[] = [
    "chest",
  ],
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

afterEach(() => {
  vi.useRealTimers();
});

describe("generateWorkoutPlan", () => {
  it("creates an active 12-week workout plan for the user", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const trainingProfile =
      createTrainingProfile();

    const result = generateWorkoutPlan(
      "user-1",
      trainingProfile,
      createWorkoutPlanTemplate(),
      createExercises(5),
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

    expect(result.id).toEqual(
      expect.any(String),
    );
  });

  it.each([
    ["beginner", 3],
    ["intermediate", 4],
    ["advanced", 5],
  ] as const)(
    "adds the correct number of exercises for %s level",
    (
      experienceLevel: ExperienceLevel,
      expectedExerciseCount,
    ) => {
      const trainingProfile =
        createTrainingProfile({
          experienceLevel,
        });

      const result = generateWorkoutPlan(
        "user-1",
        trainingProfile,
        createWorkoutPlanTemplate(),
        createExercises(5),
      );

      expect(
        result.workoutDays[0].exercises,
      ).toHaveLength(
        expectedExerciseCount,
      );
    },
  );

  it("uses workout day data from the template", () => {
    const template =
      createWorkoutPlanTemplate([
        "chest",
        "triceps",
      ]);

    const result = generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      template,
      createExercises(5, {
        muscleGroups: [
          "chest",
          "triceps",
        ],
      }),
    );

    expect(
      result.workoutDays[0],
    ).toMatchObject({
      dayNumber: 1,
      weekDay: "monday",
      name: "Workout A",
      focusMuscleGroups: [
        "chest",
        "triceps",
      ],
    });
  });

  it("uses only exercises matching the training location and experience level", () => {
    const validExercises = [
      createExercise("valid-1"),
      createExercise("valid-2"),
      createExercise("valid-3"),
    ];

    const homeExercise = createExercise(
      "home-only",
      {
        trainingLocations: ["home"],
      },
    );

    const advancedExercise =
      createExercise(
        "advanced-only",
        {
          experienceLevels: [
            "advanced",
          ],
        },
      );

    const result = generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      [
        ...validExercises,
        homeExercise,
        advancedExercise,
      ],
    );

    const selectedExerciseIds =
      result.workoutDays[0].exercises.map(
        ({ exercise }) => exercise.id,
      );

    expect(selectedExerciseIds).toEqual([
      "valid-1",
      "valid-2",
      "valid-3",
    ]);
  });

  it("prioritizes exercises specific to the selected training location", () => {
    const sharedExercise =
      createExercise("shared", {
        trainingLocations: [
          "home",
          "gym",
        ],
      });

    const gymExercises = [
      createExercise("gym-1"),
      createExercise("gym-2"),
      createExercise("gym-3"),
    ];

    const result = generateWorkoutPlan(
      "user-1",
      createTrainingProfile(),
      createWorkoutPlanTemplate(),
      [
        sharedExercise,
        ...gymExercises,
      ],
    );

    const selectedExerciseIds =
      result.workoutDays[0].exercises.map(
        ({ exercise }) => exercise.id,
      );

    expect(selectedExerciseIds).toEqual([
      "gym-1",
      "gym-2",
      "gym-3",
    ]);
  });

  it("throws an error when there are not enough exercises for a workout", () => {
    expect(() =>
      generateWorkoutPlan(
        "user-1",
        createTrainingProfile(),
        createWorkoutPlanTemplate(),
        createExercises(2),
      ),
    ).toThrow(
      "Brak wystarczającej liczby ćwiczeń do wygenerowania treningu.",
    );
  });
});