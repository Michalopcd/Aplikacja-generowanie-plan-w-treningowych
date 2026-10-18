import {
  describe,
  expect,
  it,
} from "vitest";

import type { Exercise } from "../trainingPlan";

import { getAvailableExercises } from "./exerciseSelector";

const createExercise = (
  overrides: Partial<Exercise> = {},
): Exercise => {
  return {
    id: "exercise-1",
    name: "Test exercise",
    trainingLocations: ["gym"],
    muscleGroups: ["chest"],
    experienceLevels: ["beginner"],
    ...overrides,
  };
};

describe("getAvailableExercises", () => {
  it("returns an empty array when there are no exercises", () => {
    const result = getAvailableExercises(
      [],
      "gym",
      "beginner",
    );

    expect(result).toEqual([]);
  });

  it("returns exercises available for the selected training location", () => {
    const gymExercise = createExercise({
      id: "gym-exercise",
      trainingLocations: ["gym"],
    });

    const homeExercise = createExercise({
      id: "home-exercise",
      trainingLocations: ["home"],
    });

    const result = getAvailableExercises(
      [gymExercise, homeExercise],
      "gym",
      "beginner",
    );

    expect(result).toEqual([gymExercise]);
  });

  it("returns exercises available for the selected experience level", () => {
    const beginnerExercise = createExercise({
      id: "beginner-exercise",
      experienceLevels: ["beginner"],
    });

    const advancedExercise = createExercise({
      id: "advanced-exercise",
      experienceLevels: ["advanced"],
    });

    const result = getAvailableExercises(
      [beginnerExercise, advancedExercise],
      "gym",
      "beginner",
    );

    expect(result).toEqual([beginnerExercise]);
  });

  it("returns only exercises matching both location and experience level", () => {
    const matchingExercise = createExercise({
      id: "matching-exercise",
      trainingLocations: ["home", "gym"],
      experienceLevels: [
        "beginner",
        "intermediate",
      ],
    });

    const wrongLocationExercise = createExercise({
      id: "wrong-location",
      trainingLocations: ["home"],
      experienceLevels: ["beginner"],
    });

    const wrongLevelExercise = createExercise({
      id: "wrong-level",
      trainingLocations: ["gym"],
      experienceLevels: ["advanced"],
    });

    const result = getAvailableExercises(
      [
        matchingExercise,
        wrongLocationExercise,
        wrongLevelExercise,
      ],
      "gym",
      "beginner",
    );

    expect(result).toEqual([matchingExercise]);
  });
});