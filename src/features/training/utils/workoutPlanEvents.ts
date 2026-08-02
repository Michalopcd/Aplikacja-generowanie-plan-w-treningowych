import type { EventInput } from "@fullcalendar/core";

import type { WeekDay, WorkoutPlan } from "../trainingPlan";
import { formatDateToISO } from "./dateUtils";

const weekDayToFullCalendarDay: Record<WeekDay, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const getPlanEndDate = (
  startDate: string,
  durationWeeks: number,
): string => {
  const [year, month, day] = startDate.split("-").map(Number);

  const endDate = new Date(year, month - 1, day);

  endDate.setDate(endDate.getDate() + durationWeeks * 7);

  return formatDateToISO(endDate);
};

export const createWorkoutPlanEvents = (
  plan: WorkoutPlan,
): EventInput[] => {
  const endRecur = getPlanEndDate(
    plan.startDate,
    plan.durationWeeks,
  );

  return plan.workoutDays.map((workoutDay) => ({
    id: `workout-day-${workoutDay.dayNumber}`,
    title: workoutDay.name,
    daysOfWeek: [
      weekDayToFullCalendarDay[workoutDay.weekDay],
    ],
    startRecur: plan.startDate,
    endRecur,
    allDay: true,
    extendedProps: {
      workoutDay,
    },
  }));
};