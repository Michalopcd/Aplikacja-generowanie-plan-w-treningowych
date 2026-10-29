import { describe, expect, it } from "vitest";

import { formatExerciseCount } from "./formatExerciseCount";

describe("formatExerciseCount", () => {
  it("returns singular form for 1 exercise", () => {
    expect(formatExerciseCount(1)).toBe("1 ćwiczenie");
  });

  it("returns 'ćwiczenia' for numbers ending with 2, 3 or 4", () => {
    expect(formatExerciseCount(2)).toBe("2 ćwiczenia");

    expect(formatExerciseCount(3)).toBe("3 ćwiczenia");

    expect(formatExerciseCount(4)).toBe("4 ćwiczenia");
  });

  it("returns 'ćwiczeń' for 0 and numbers from 5 to 10", () => {
    expect(formatExerciseCount(0)).toBe("0 ćwiczeń");

    expect(formatExerciseCount(5)).toBe("5 ćwiczeń");

    expect(formatExerciseCount(10)).toBe("10 ćwiczeń");
  });

  it("returns 'ćwiczeń' for numbers from 12 to 14", () => {
    expect(formatExerciseCount(12)).toBe("12 ćwiczeń");

    expect(formatExerciseCount(13)).toBe("13 ćwiczeń");

    expect(formatExerciseCount(14)).toBe("14 ćwiczeń");
  });

  it("returns correct form for larger numbers", () => {
    expect(formatExerciseCount(21)).toBe("21 ćwiczeń");

    expect(formatExerciseCount(22)).toBe("22 ćwiczenia");

    expect(formatExerciseCount(23)).toBe("23 ćwiczenia");

    expect(formatExerciseCount(24)).toBe("24 ćwiczenia");

    expect(formatExerciseCount(25)).toBe("25 ćwiczeń");
  });

  it("handles numbers ending with 12, 13 and 14 correctly", () => {
    expect(formatExerciseCount(112)).toBe("112 ćwiczeń");

    expect(formatExerciseCount(113)).toBe("113 ćwiczeń");

    expect(formatExerciseCount(114)).toBe("114 ćwiczeń");
  });
});
