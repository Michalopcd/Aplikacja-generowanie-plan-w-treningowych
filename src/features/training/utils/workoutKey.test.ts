import {
  describe,
  expect,
  it,
} from "vitest";

import { createWorkoutKey } from "./workoutKey";

describe("createWorkoutKey", () => {
  it("creates a workout key from the scheduled date and workout day number", () => {
    const result = createWorkoutKey(
      "2026-10-08",
      2,
    );

    expect(result).toBe("2026-10-08_2");
  });
});