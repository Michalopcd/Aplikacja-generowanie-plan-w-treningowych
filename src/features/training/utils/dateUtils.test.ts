import {
  describe,
  expect,
  it,
} from "vitest";

import {
  formatDateToISO,
  formatISODateToDisplayDate,
  getMondayOfWeek,
  getWeekDayFromISODate,
} from "./dateUtils";

describe("formatDateToISO", () => {
  it("formats a date as YYYY-MM-DD", () => {
    const date = new Date(2026, 9, 8);

    const result = formatDateToISO(date);

    expect(result).toBe("2026-10-08");
  });

  it("adds leading zeros to single-digit months and days", () => {
    const date = new Date(2026, 0, 5);

    const result = formatDateToISO(date);

    expect(result).toBe("2026-01-05");
  });
});

describe("getMondayOfWeek", () => {
  it("returns Monday for a date during the week", () => {
    const date = new Date(2026, 9, 8, 15, 30);

    const result = getMondayOfWeek(date);

    expect(result).toEqual(
      new Date(2026, 9, 5, 0, 0, 0, 0),
    );
  });

  it("returns the previous Monday when the date is Sunday", () => {
    const sunday = new Date(2026, 9, 11);

    const result = getMondayOfWeek(sunday);

    expect(result).toEqual(
      new Date(2026, 9, 5, 0, 0, 0, 0),
    );
  });

  it("does not modify the original date", () => {
    const date = new Date(2026, 9, 8, 15, 30);
    const originalDate = new Date(date);

    getMondayOfWeek(date);

    expect(date).toEqual(originalDate);
  });
});

describe("formatISODateToDisplayDate", () => {
  it("formats an ISO date using the Polish date format", () => {
    const result =
      formatISODateToDisplayDate("2026-10-08");

    expect(result).toBe("8.10.2026");
  });
});

describe("getWeekDayFromISODate", () => {
  it.each([
    ["2026-10-05", "monday"],
    ["2026-10-06", "tuesday"],
    ["2026-10-07", "wednesday"],
    ["2026-10-08", "thursday"],
    ["2026-10-09", "friday"],
    ["2026-10-10", "saturday"],
    ["2026-10-11", "sunday"],
  ])(
    "returns %s weekday as %s",
    (date, expectedWeekDay) => {
      const result =
        getWeekDayFromISODate(date);

      expect(result).toBe(expectedWeekDay);
    },
  );
});