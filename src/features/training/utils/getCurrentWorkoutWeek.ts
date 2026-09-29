import type { WorkoutPlan } from "../trainingPlan";
import { createWorkoutSchedule } from "./workoutSchedule";
import { formatDateToISO } from "./dateUtils";

export const getCurrentWorkoutWeekNumber = (
  plan: WorkoutPlan,
): number => {
  const workoutSchedule =
    createWorkoutSchedule(plan);

  const today = formatDateToISO(new Date());

  const currentWeek = workoutSchedule.find(
    (scheduleWeek) =>
      today >= scheduleWeek.weekStartDate &&
      today <= scheduleWeek.weekEndDate,
  );

  return currentWeek?.weekNumber ?? 1;
};