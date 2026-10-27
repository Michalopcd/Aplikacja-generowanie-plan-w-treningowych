import { describe, expect, it } from "vitest";

import type { Exercise, MuscleGroup } from "../trainingPlan";

import { selectExercisesForDay } from "./selectExercisesForDay";

const createExercise = (
  id: string,
  muscleGroups: MuscleGroup[] = ["chest"],
): Exercise => {
  return {
    id,
    name: `Exercise ${id}`,
    trainingLocations: ["gym"],
    muscleGroups,
    experienceLevels: ["beginner", "intermediate", "advanced"],
  };
};

describe("selectExercisesForDay", () => {
  it("selects the requested number of exercises", () => {
    const exercises = [
      createExercise("1"),
      createExercise("2"),
      createExercise("3"),
      createExercise("4"),
    ];

    const result = selectExercisesForDay(exercises, ["chest"], 3);

    expect(result).toHaveLength(3);
  });

  it("selects only exercises matching the focus muscle groups", () => {
    const exercises = [
      createExercise("chest-1", ["chest"]),
      createExercise("chest-2", ["chest"]),
      createExercise("chest-3", ["chest"]),
      createExercise("legs", ["quadriceps"]),
    ];

    const result = selectExercisesForDay(exercises, ["chest"], 3);

    expect(result.map((exercise) => exercise.id)).toEqual([
      "chest-1",
      "chest-2",
      "chest-3",
    ]);
  });

  it("selects exercises for different focus muscle groups", () => {
    const exercises = [
      createExercise("chest", ["chest"]),
      createExercise("triceps", ["triceps"]),
      createExercise("shoulders", ["shoulders"]),
      createExercise("extra", ["chest"]),
    ];

    const result = selectExercisesForDay(
      exercises,
      ["chest", "triceps", "shoulders"],
      3,
    );

    expect(result.map((exercise) => exercise.id)).toEqual([
      "chest",
      "triceps",
      "shoulders",
    ]);
  });

  it("does not select the same exercise more than once", () => {
    const exercises = [
      createExercise("multi-muscle", ["chest", "triceps"]),
      createExercise("chest", ["chest"]),
      createExercise("triceps", ["triceps"]),
    ];

    const result = selectExercisesForDay(exercises, ["chest", "triceps"], 2);

    const ids = result.map((exercise) => exercise.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("throws an error when there are not enough matching exercises", () => {
    const exercises = [createExercise("1"), createExercise("2")];

    expect(() => selectExercisesForDay(exercises, ["chest"], 3)).toThrow(
      "Brak wystarczającej liczby ćwiczeń do wygenerowania treningu.",
    );
  });
});
