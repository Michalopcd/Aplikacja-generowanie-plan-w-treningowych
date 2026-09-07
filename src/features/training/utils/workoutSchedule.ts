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

  const planCreatedDate = parseISODate(
    formatDateToISO(plan.createdAt),
  );

  const effectiveStartDate =
    planCreatedDate > planStartDate
      ? planCreatedDate
      : planStartDate;

  const sortedWorkoutDays = [...plan.workoutDays].sort(
    (firstWorkoutDay, secondWorkoutDay) =>
      weekDayOffset[firstWorkoutDay.weekDay] -
      weekDayOffset[secondWorkoutDay.weekDay],
  );

  let trainingNumber = 1;

  return Array.from(
    { length: plan.durationWeeks },
    (_, weekIndex) => {
      const weekNumber = weekIndex + 1;

      const calendarWeekStartDate = addDays(
        planStartDate,
        weekIndex * 7,
      );

      const weekEndDate = addDays(
        calendarWeekStartDate,
        6,
      );

      const workouts = sortedWorkoutDays.flatMap(
        (workoutDay) => {
          const scheduledDate = addDays(
            calendarWeekStartDate,
            weekDayOffset[workoutDay.weekDay],
          );

          if (
            weekIndex === 0 &&
            scheduledDate < effectiveStartDate
          ) {
            return [];
          }

          const scheduledWorkout: ScheduledWorkout = {
            weekNumber,
            trainingNumber,
            scheduledDate:
              formatDateToISO(scheduledDate),
            workoutDay,
          };

          trainingNumber += 1;

          return [scheduledWorkout];
        },
      );

      const displayedWeekStartDate =
        weekIndex === 0 &&
        effectiveStartDate > calendarWeekStartDate
          ? effectiveStartDate
          : calendarWeekStartDate;

      return {
        weekNumber,
        weekStartDate:
          formatDateToISO(displayedWeekStartDate),
        weekEndDate:
          formatDateToISO(weekEndDate),
        workouts,
      };
    },
  );
};