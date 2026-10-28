import { describe, expect, it } from "vitest";

import type { CompletedWorkout } from "../completedWorkout";
import type { ScheduledWorkout, WorkoutScheduleWeek } from "./workoutSchedule";

import { createProgressStats } from "./progressStats";

const createScheduledWorkout = (trainingNumber: number): ScheduledWorkout => {
  return {
    weekNumber: 1,
    trainingNumber,
    scheduledDate: "2026-10-05",
    workoutDay: {
      dayNumber: trainingNumber,
      weekDay: "monday",
      name: `Workout ${trainingNumber}`,
      focusMuscleGroups: ["chest"],
      exercises: [],
    },
  };
};

const createScheduleWeek = (workoutsCount: number): WorkoutScheduleWeek => {
  return {
    weekNumber: 1,
    weekStartDate: "2026-10-05",
    weekEndDate: "2026-10-11",
    workouts: Array.from({ length: workoutsCount }, (_, index) =>
      createScheduledWorkout(index + 1),
    ),
  };
};

const createCompletedWorkout = (
  weekNumber: number,
  overrides: Partial<CompletedWorkout> = {},
): CompletedWorkout => {
  return {
    id: `completed-${weekNumber}`,
    uid: "user-1",
    workoutPlanId: "plan-1",
    workoutDayNumber: 1,
    workoutDayName: "Workout 1",
    weekNumber,
    trainingNumber: 1,
    scheduledDate: "2026-10-05",
    completedDate: "2026-10-05",
    completedAt: new Date(2026, 9, 5),
    goal: "mass",
    exerciseCount: 3,
    ...overrides,
  };
};

describe("createProgressStats", () => {
  it("returns zero stats when there are no planned or completed workouts", () => {
    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts: [],
      currentWeekNumber: null,
    });

    expect(result).toEqual({
      plannedWorkoutsCount: 0,
      completedWorkoutsCount: 0,
      completionPercentage: 0,
      currentWeekCompletedWorkoutsCount: 0,
    });
  });

  it("calculates the total number of planned workouts", () => {
    const workoutSchedule = [createScheduleWeek(3), createScheduleWeek(2)];

    const result = createProgressStats({
      workoutSchedule,
      completedWorkouts: [],
      currentWeekNumber: null,
    });

    expect(result.plannedWorkoutsCount).toBe(5);
  });

  it("calculates the number of completed workouts", () => {
    const completedWorkouts = [
      createCompletedWorkout(1),
      createCompletedWorkout(1, {
        id: "completed-2",
      }),
      createCompletedWorkout(2, {
        id: "completed-3",
      }),
    ];

    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts,
      currentWeekNumber: null,
    });

    expect(result.completedWorkoutsCount).toBe(3);
  });

  it("calculates and rounds the completion percentage", () => {
    const workoutSchedule = [createScheduleWeek(3)];

    const completedWorkouts = [createCompletedWorkout(1)];

    const result = createProgressStats({
      workoutSchedule,
      completedWorkouts,
      currentWeekNumber: 1,
    });

    expect(result.completionPercentage).toBe(33);
  });

  it("counts completed workouts from the current week", () => {
    const completedWorkouts = [
      createCompletedWorkout(1, {
        id: "completed-1",
      }),
      createCompletedWorkout(2, {
        id: "completed-2",
      }),
      createCompletedWorkout(2, {
        id: "completed-3",
      }),
      createCompletedWorkout(3, {
        id: "completed-4",
      }),
    ];

    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts,
      currentWeekNumber: 2,
    });

    expect(result.currentWeekCompletedWorkoutsCount).toBe(2);
  });

  it("returns zero current week workouts when current week is not available", () => {
    const completedWorkouts = [
      createCompletedWorkout(1),
      createCompletedWorkout(2, {
        id: "completed-2",
      }),
    ];

    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts,
      currentWeekNumber: null,
    });

    expect(result.currentWeekCompletedWorkoutsCount).toBe(0);
  });
});
