import {
  describe,
  expect,
  it,
} from "vitest";

import type {
  WeekDay,
  WorkoutDay,
  WorkoutPlan,
} from "../trainingPlan";

import { createWorkoutSchedule } from "./workoutSchedule";

const createWorkoutDay = (
  dayNumber: number,
  weekDay: WeekDay,
): WorkoutDay => {
  return {
    dayNumber,
    name: `Workout ${dayNumber}`,
    weekDay,
    focusMuscleGroups: ["chest"],
    exercises: [],
  } as WorkoutDay;
};

const createWorkoutPlan = (
  overrides: Partial<WorkoutPlan> = {},
): WorkoutPlan => {
  return {
    id: "plan-1",
    uid: "user-1",
    startDate: "2026-10-05",
    createdAt: new Date(2026, 9, 5),
    durationWeeks: 2,
    workoutDays: [
      createWorkoutDay(1, "monday"),
      createWorkoutDay(2, "wednesday"),
      createWorkoutDay(3, "friday"),
    ],
    scheduleOverrides: [],
    ...overrides,
  } as WorkoutPlan;
};

describe("createWorkoutSchedule", () => {
  it("creates the expected number of schedule weeks", () => {
    const plan = createWorkoutPlan({
      durationWeeks: 2,
    });

    const result = createWorkoutSchedule(plan);

    expect(result).toHaveLength(2);

    expect(result[0]).toMatchObject({
      weekNumber: 1,
      weekStartDate: "2026-10-05",
      weekEndDate: "2026-10-11",
    });

    expect(result[1]).toMatchObject({
      weekNumber: 2,
      weekStartDate: "2026-10-12",
      weekEndDate: "2026-10-18",
    });
  });

  it("sorts workouts by weekday", () => {
    const fridayWorkout =
      createWorkoutDay(3, "friday");
    const mondayWorkout =
      createWorkoutDay(1, "monday");
    const wednesdayWorkout =
      createWorkoutDay(2, "wednesday");

    const plan = createWorkoutPlan({
      durationWeeks: 1,
      workoutDays: [
        fridayWorkout,
        mondayWorkout,
        wednesdayWorkout,
      ],
    });

    const result = createWorkoutSchedule(plan);

    expect(
      result[0].workouts.map(
        (workout) => workout.workoutDay.dayNumber,
      ),
    ).toEqual([1, 2, 3]);
  });

  it("assigns sequential training numbers", () => {
    const plan = createWorkoutPlan({
      durationWeeks: 2,
      workoutDays: [
        createWorkoutDay(1, "monday"),
        createWorkoutDay(2, "friday"),
      ],
    });

    const result = createWorkoutSchedule(plan);

    const trainingNumbers = result.flatMap(
      (scheduleWeek) =>
        scheduleWeek.workouts.map(
          (workout) => workout.trainingNumber,
        ),
    );

    expect(trainingNumbers).toEqual([
      1, 2, 3, 4,
    ]);
  });

  it("skips first-week workouts scheduled before the plan creation date", () => {
    const plan = createWorkoutPlan({
      createdAt: new Date(2026, 9, 8),
      durationWeeks: 1,
    });

    const result = createWorkoutSchedule(plan);

    expect(result[0].weekStartDate).toBe(
      "2026-10-08",
    );

    expect(
      result[0].workouts.map(
        (workout) => workout.scheduledDate,
      ),
    ).toEqual(["2026-10-09"]);
  });

  it("uses a schedule override when one exists", () => {
    const plan = createWorkoutPlan({
      durationWeeks: 1,
      workoutDays: [
        createWorkoutDay(1, "monday"),
      ],
      scheduleOverrides: [
        {
          weekNumber: 1,
          workoutDayNumber: 1,
          scheduledDate: "2026-10-08",
        },
      ],
    });

    const result = createWorkoutSchedule(plan);

    expect(
      result[0].workouts[0].scheduledDate,
    ).toBe("2026-10-08");
  });

  it("does not change the original workout days order", () => {
    const fridayWorkout =
      createWorkoutDay(2, "friday");
    const mondayWorkout =
      createWorkoutDay(1, "monday");

    const workoutDays = [
      fridayWorkout,
      mondayWorkout,
    ];

    const plan = createWorkoutPlan({
      durationWeeks: 1,
      workoutDays,
    });

    createWorkoutSchedule(plan);

    expect(
      plan.workoutDays.map(
        (workoutDay) => workoutDay.dayNumber,
      ),
    ).toEqual([2, 1]);
  });
});