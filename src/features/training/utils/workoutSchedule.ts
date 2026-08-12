import type {
  WeekDay,
  WorkoutDay,
  WorkoutPlan,
} from "../trainingPlan";
import { formatDateToISO } from "./dateUtils";

export type ScheduledWorkout = {
  weekNumber: number;
  trainingNumber: number;
  scheduledDate: string;
  workoutDay: WorkoutDay;
};

export type WorkoutScheduleWeek = {
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  workouts: ScheduledWorkout[];
};

const weekDayOffset: Record<WeekDay, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

const parseISODate = (date: string): Date => {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate;
};

export const createWorkoutSchedule = (
  plan: WorkoutPlan,
): WorkoutScheduleWeek[] => {
  const planStartDate = parseISODate(plan.startDate);

  const sortedWorkoutDays = [...plan.workoutDays].sort(
    (firstWorkoutDay, secondWorkoutDay) =>
      weekDayOffset[firstWorkoutDay.weekDay] -
      weekDayOffset[secondWorkoutDay.weekDay],
  );

  return Array.from({ length: plan.durationWeeks }, (_, weekIndex) => {
    const weekNumber = weekIndex + 1;

    const weekStartDate = addDays(planStartDate, weekIndex * 7);
    const weekEndDate = addDays(weekStartDate, 6);

    const workouts = sortedWorkoutDays.map(
      (workoutDay, workoutDayIndex) => {
        const scheduledDate = addDays(
          weekStartDate,
          weekDayOffset[workoutDay.weekDay],
        );

        const trainingNumber =
          weekIndex * sortedWorkoutDays.length + workoutDayIndex + 1;

        return {
          weekNumber,
          trainingNumber,
          scheduledDate: formatDateToISO(scheduledDate),
          workoutDay,
        };
      },
    );

    return {
      weekNumber,
      weekStartDate: formatDateToISO(weekStartDate),
      weekEndDate: formatDateToISO(weekEndDate),
      workouts,
    };
  });
};