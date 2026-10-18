import {
  describe,
  expect,
  it,
} from "vitest";

import type { CompletedWorkout } from "../completedWorkout";
import type { WorkoutScheduleWeek } from "./workoutSchedule";

import { createProgressStats } from "./progressStats";

const createScheduleWeek = (
  workoutsCount: number,
): WorkoutScheduleWeek => {
  return {
    workouts: Array.from(
      { length: workoutsCount },
      () => ({}),
    ),
  } as WorkoutScheduleWeek;
};

const createCompletedWorkout = (
  weekNumber: number,
): CompletedWorkout => {
  return {
    weekNumber,
  } as CompletedWorkout;
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
    const workoutSchedule = [
      createScheduleWeek(3),
      createScheduleWeek(2),
    ];

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
      createCompletedWorkout(1),
      createCompletedWorkout(2),
    ];

    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts,
      currentWeekNumber: null,
    });

    expect(result.completedWorkoutsCount).toBe(3);
  });

  it("calculates and rounds the completion percentage", () => {
    const workoutSchedule = [
      createScheduleWeek(3),
    ];

    const completedWorkouts = [
      createCompletedWorkout(1),
    ];

    const result = createProgressStats({
      workoutSchedule,
      completedWorkouts,
      currentWeekNumber: 1,
    });

    expect(result.completionPercentage).toBe(33);
  });

  it("counts completed workouts from the current week", () => {
    const completedWorkouts = [
      createCompletedWorkout(1),
      createCompletedWorkout(2),
      createCompletedWorkout(2),
      createCompletedWorkout(3),
    ];

    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts,
      currentWeekNumber: 2,
    });

    expect(
      result.currentWeekCompletedWorkoutsCount,
    ).toBe(2);
  });

  it("returns zero current week workouts when current week is not available", () => {
    const completedWorkouts = [
      createCompletedWorkout(1),
      createCompletedWorkout(2),
    ];

    const result = createProgressStats({
      workoutSchedule: [],
      completedWorkouts,
      currentWeekNumber: null,
    });

    expect(
      result.currentWeekCompletedWorkoutsCount,
    ).toBe(0);
  });
});