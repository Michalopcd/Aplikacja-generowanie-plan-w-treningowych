import type { WorkoutPlan } from "../trainingPlan";

import { formatDateToISO } from "./dateUtils";
import { createWorkoutSchedule } from "./workoutSchedule";

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