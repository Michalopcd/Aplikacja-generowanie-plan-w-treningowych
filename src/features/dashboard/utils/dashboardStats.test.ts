import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type { CompletedWorkout } from "../../training/completedWorkout";
import type { WeekDay } from "../../training/trainingPlan";
import type {
  ScheduledWorkout,
  WorkoutScheduleWeek,
} from "../../training/utils/workoutSchedule";

import { createDashboardStats } from "./dashboardStats";

const NOW = new Date(2026, 9, 8, 12);

const createScheduledWorkout = ({
  scheduledDate,
  dayNumber,
  weekDay,
  weekNumber = 1,
  trainingNumber = 1,
}: {
  scheduledDate: string;
  dayNumber: number;
  weekDay: WeekDay;
  weekNumber?: number;
  trainingNumber?: number;
}): ScheduledWorkout => {
  return {
    weekNumber,
    trainingNumber,
    scheduledDate,
    workoutDay: {
      dayNumber,
      weekDay,
      name: `Workout ${dayNumber}`,
      focusMuscleGroups: ["chest"],
      exercises: [],
    },
  };
};

const createScheduleWeek = ({
  weekNumber,
  weekStartDate,
  weekEndDate,
  workouts,
}: {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  workouts: ScheduledWorkout[];
}): WorkoutScheduleWeek => {
  return {
    weekNumber,
    weekStartDate,
    weekEndDate,
    workouts,
  };
};

const createCompletedWorkout = (
  scheduledDate: string,
  workoutDayNumber: number,
  completedDate: string = scheduledDate,
): CompletedWorkout => {
  return {
    scheduledDate,
    workoutDayNumber,
    completedDate,
  } as CompletedWorkout;
};

afterEach(() => {
  vi.useRealTimers();
});

describe("createDashboardStats", () => {
  it("returns zero stats when there are no workouts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const result = createDashboardStats({
      workoutSchedule: [],
      completedWorkouts: [],
    });

    expect(result).toMatchObject({
      completedWorkoutsCount: 0,
      plannedWorkoutsCount: 0,
      completionPercentage: 0,
      workoutStreakCount: 0,
      currentWeekNumber: null,
      currentWeekCompletedWorkoutsCount: 0,
      currentWeekPlannedWorkoutsCount: 0,
    });

    expect(result.currentWeekChartData).toEqual([
      {
        label: "Wykonane",
        value: 0,
      },
      {
        label: "Pozostałe",
        value: 0,
      },
    ]);

    expect(result.recentWorkoutActivity).toEqual([]);
  });

  it("calculates planned, completed and percentage statistics", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const workoutSchedule = [
      createScheduleWeek({
        weekNumber: 1,
        weekStartDate: "2026-10-05",
        weekEndDate: "2026-10-11",
        workouts: [
          createScheduledWorkout({
            scheduledDate: "2026-10-05",
            dayNumber: 1,
            weekDay: "monday",
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-07",
            dayNumber: 2,
            weekDay: "wednesday",
            trainingNumber: 2,
          }),
        ],
      }),
      createScheduleWeek({
        weekNumber: 2,
        weekStartDate: "2026-10-12",
        weekEndDate: "2026-10-18",
        workouts: [
          createScheduledWorkout({
            scheduledDate: "2026-10-12",
            dayNumber: 1,
            weekDay: "monday",
            weekNumber: 2,
            trainingNumber: 3,
          }),
        ],
      }),
    ];

    const completedWorkouts = [
      createCompletedWorkout(
        "2026-10-05",
        1,
      ),
      createCompletedWorkout(
        "2026-10-07",
        2,
      ),
    ];

    const result = createDashboardStats({
      workoutSchedule,
      completedWorkouts,
    });

    expect(result.plannedWorkoutsCount).toBe(3);
    expect(result.completedWorkoutsCount).toBe(2);
    expect(result.completionPercentage).toBe(67);
  });

  it("calculates statistics for the current week", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const workoutSchedule = [
      createScheduleWeek({
        weekNumber: 1,
        weekStartDate: "2026-10-05",
        weekEndDate: "2026-10-11",
        workouts: [
          createScheduledWorkout({
            scheduledDate: "2026-10-05",
            dayNumber: 1,
            weekDay: "monday",
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-07",
            dayNumber: 2,
            weekDay: "wednesday",
            trainingNumber: 2,
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-09",
            dayNumber: 3,
            weekDay: "friday",
            trainingNumber: 3,
          }),
        ],
      }),
    ];

    const completedWorkouts = [
      createCompletedWorkout(
        "2026-10-05",
        1,
      ),
      createCompletedWorkout(
        "2026-10-07",
        2,
      ),
    ];

    const result = createDashboardStats({
      workoutSchedule,
      completedWorkouts,
    });

    expect(result.currentWeekNumber).toBe(1);

    expect(
      result.currentWeekPlannedWorkoutsCount,
    ).toBe(3);

    expect(
      result.currentWeekCompletedWorkoutsCount,
    ).toBe(2);

    expect(result.currentWeekChartData).toEqual([
      {
        label: "Wykonane",
        value: 2,
      },
      {
        label: "Pozostałe",
        value: 1,
      },
    ]);
  });

  it("calculates the workout streak from the most recent workouts", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const workoutSchedule = [
      createScheduleWeek({
        weekNumber: 1,
        weekStartDate: "2026-10-05",
        weekEndDate: "2026-10-11",
        workouts: [
          createScheduledWorkout({
            scheduledDate: "2026-10-05",
            dayNumber: 1,
            weekDay: "monday",
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-07",
            dayNumber: 2,
            weekDay: "wednesday",
            trainingNumber: 2,
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-08",
            dayNumber: 3,
            weekDay: "thursday",
            trainingNumber: 3,
          }),
        ],
      }),
    ];

    const completedWorkouts = [
      createCompletedWorkout(
        "2026-10-07",
        2,
      ),
      createCompletedWorkout(
        "2026-10-08",
        3,
      ),
    ];

    const result = createDashboardStats({
      workoutSchedule,
      completedWorkouts,
    });

    expect(result.workoutStreakCount).toBe(2);
  });

  it("returns zero streak when the most recent workout is not completed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const workoutSchedule = [
      createScheduleWeek({
        weekNumber: 1,
        weekStartDate: "2026-10-05",
        weekEndDate: "2026-10-11",
        workouts: [
          createScheduledWorkout({
            scheduledDate: "2026-10-07",
            dayNumber: 1,
            weekDay: "wednesday",
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-08",
            dayNumber: 2,
            weekDay: "thursday",
            trainingNumber: 2,
          }),
        ],
      }),
    ];

    const completedWorkouts = [
      createCompletedWorkout(
        "2026-10-07",
        1,
      ),
    ];

    const result = createDashboardStats({
      workoutSchedule,
      completedWorkouts,
    });

    expect(result.workoutStreakCount).toBe(0);
  });

  it("creates completed workout chart data for the last seven days", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const completedWorkouts = [
      createCompletedWorkout(
        "2026-10-02",
        1,
        "2026-10-02",
      ),
      createCompletedWorkout(
        "2026-10-08",
        2,
        "2026-10-08",
      ),
      createCompletedWorkout(
        "2026-10-08",
        3,
        "2026-10-08",
      ),
    ];

    const result = createDashboardStats({
      workoutSchedule: [],
      completedWorkouts,
    });

    expect(
      result.completedWorkoutsChartData,
    ).toHaveLength(7);

    expect(
      result.completedWorkoutsChartData.map(
        (item) => item.value,
      ),
    ).toEqual([
      1, 0, 0, 0, 0, 0, 2,
    ]);
  });

  it("creates recent activity only from workouts scheduled up to today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);

    const workoutSchedule = [
      createScheduleWeek({
        weekNumber: 1,
        weekStartDate: "2026-10-05",
        weekEndDate: "2026-10-11",
        workouts: [
          createScheduledWorkout({
            scheduledDate: "2026-10-05",
            dayNumber: 1,
            weekDay: "monday",
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-06",
            dayNumber: 2,
            weekDay: "tuesday",
            trainingNumber: 2,
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-07",
            dayNumber: 3,
            weekDay: "wednesday",
            trainingNumber: 3,
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-08",
            dayNumber: 4,
            weekDay: "thursday",
            trainingNumber: 4,
          }),
          createScheduledWorkout({
            scheduledDate: "2026-10-09",
            dayNumber: 5,
            weekDay: "friday",
            trainingNumber: 5,
          }),
        ],
      }),
    ];

    const completedWorkouts = [
      createCompletedWorkout(
        "2026-10-05",
        1,
      ),
      createCompletedWorkout(
        "2026-10-07",
        3,
      ),
      createCompletedWorkout(
        "2026-10-08",
        4,
      ),
    ];

    const result = createDashboardStats({
      workoutSchedule,
      completedWorkouts,
    });

    expect(
      result.recentWorkoutActivity,
    ).toHaveLength(4);

    expect(
      result.recentWorkoutActivity.map(
        (item) => item.value,
      ),
    ).toEqual([1, 0, 1, 1]);
  });
});