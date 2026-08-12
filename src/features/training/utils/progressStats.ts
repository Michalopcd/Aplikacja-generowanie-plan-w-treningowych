import type { CompletedWorkout } from "../completedWorkout";
import type { WorkoutScheduleWeek } from "./workoutSchedule";

export type ProgressStats = {
  plannedWorkoutsCount: number;
  completedWorkoutsCount: number;
  completionPercentage: number;
  currentWeekCompletedWorkoutsCount: number;
};

type CreateProgressStatsInput = {
  workoutSchedule: WorkoutScheduleWeek[];
  completedWorkouts: CompletedWorkout[];
  currentWeekNumber: number | null;
};

export const createProgressStats = ({
  workoutSchedule,
  completedWorkouts,
  currentWeekNumber,
}: CreateProgressStatsInput): ProgressStats => {
  const plannedWorkoutsCount = workoutSchedule.reduce(
    (total, scheduleWeek) => total + scheduleWeek.workouts.length,
    0,
  );

  const completedWorkoutsCount = completedWorkouts.length;

  const completionPercentage =
    plannedWorkoutsCount > 0
      ? Math.round(
          (completedWorkoutsCount / plannedWorkoutsCount) * 100,
        )
      : 0;

  const currentWeekCompletedWorkoutsCount =
    currentWeekNumber === null
      ? 0
      : completedWorkouts.filter(
          (completedWorkout) =>
            completedWorkout.weekNumber === currentWeekNumber,
        ).length;

  return {
    plannedWorkoutsCount,
    completedWorkoutsCount,
    completionPercentage,
    currentWeekCompletedWorkoutsCount,
  };
};