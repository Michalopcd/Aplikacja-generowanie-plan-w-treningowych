import {
  describe,
  expect,
  it,
} from "vitest";

import { addExerciseSchema } from "./addExerciseSchema";

const createValidExerciseData = () => {
  return {
    name: "Wyciskanie sztangi",
    trainingLocation: "gym",
    muscleGroup: "chest",
    experienceLevels: [
      "beginner",
      "intermediate",
    ],
  };
};

describe("addExerciseSchema", () => {
  it("accepts valid exercise data", async () => {
    const result = await addExerciseSchema.isValid(
      createValidExerciseData(),
    );

    expect(result).toBe(true);
  });

  it("rejects an empty exercise name", async () => {
    const result = await addExerciseSchema.isValid({
      ...createValidExerciseData(),
      name: "",
    });

    expect(result).toBe(false);
  });

  it("rejects a name containing only spaces", async () => {
    const result = await addExerciseSchema.isValid({
      ...createValidExerciseData(),
      name: "   ",
    });

    expect(result).toBe(false);
  });

  it("rejects an invalid training location", async () => {
    const result = await addExerciseSchema.isValid({
      ...createValidExerciseData(),
      trainingLocation: "park",
    });

    expect(result).toBe(false);
  });

  it("rejects a missing muscle group", async () => {
    const result = await addExerciseSchema.isValid({
      ...createValidExerciseData(),
      muscleGroup: undefined,
    });

    expect(result).toBe(false);
  });

  it("rejects an empty experience levels array", async () => {
    const result = await addExerciseSchema.isValid({
      ...createValidExerciseData(),
      experienceLevels: [],
    });

    expect(result).toBe(false);
  });

  it("rejects an invalid experience level", async () => {
    const result = await addExerciseSchema.isValid({
      ...createValidExerciseData(),
      experienceLevels: ["expert"],
    });

    expect(result).toBe(false);
  });
});