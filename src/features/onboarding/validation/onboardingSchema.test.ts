import {
  describe,
  expect,
  it,
} from "vitest";

import { onboardingSchema } from "./onboardingSchema";

const createValidOnboardingData = () => {
  return {
    firstName: "Michał",
    age: "25",
    height: "180",
    weight: "80",
    experienceLevel: "beginner",
    goal: "mass",
    gender: "male",
    trainingLocation: "gym",
    trainingDaysPerWeek: "3",
  };
};

describe("onboardingSchema", () => {
  it("accepts valid onboarding data", async () => {
    const result = await onboardingSchema.isValid(
      createValidOnboardingData(),
    );

    expect(result).toBe(true);
  });

  it("rejects a first name shorter than two characters", async () => {
    const result = await onboardingSchema.isValid({
      ...createValidOnboardingData(),
      firstName: "M",
    });

    expect(result).toBe(false);
  });

  it.each([
    ["age", 11],
    ["age", 101],
    ["height", 99],
    ["height", 251],
    ["weight", 29],
    ["weight", 251],
  ] as const)(
    "rejects %s value outside the allowed range",
    async (field, value) => {
      const result =
        await onboardingSchema.isValid({
          ...createValidOnboardingData(),
          [field]: value,
        });

      expect(result).toBe(false);
    },
  );

  it.each([
    ["experienceLevel", "expert"],
    ["goal", "strength"],
    ["gender", "other"],
    ["trainingLocation", "park"],
    ["trainingDaysPerWeek", "7"],
  ] as const)(
    "rejects an invalid %s value",
    async (field, value) => {
      const result =
        await onboardingSchema.isValid({
          ...createValidOnboardingData(),
          [field]: value,
        });

      expect(result).toBe(false);
    },
  );

  it("rejects missing required data", async () => {
    const result = await onboardingSchema.isValid({
      ...createValidOnboardingData(),
      firstName: "",
    });

    expect(result).toBe(false);
  });
});