import type { CompletedWorkout } from "../../training/completedWorkout";
import type {
  ScheduledWorkout,
  WorkoutScheduleWeek,
} from "../../training/utils/workoutSchedule";

import { weekDayLabels } from "../../training/constants/trainingLabels";
import { formatDateToISO } from "../../training/utils/dateUtils";
import { createWorkoutKey } from "../../training/utils/workoutKey";

type CreateDashboardStatsInput = {
  workoutSchedule: WorkoutScheduleWeek[];
  completedWorkouts: CompletedWorkout[];
};

export type DashboardChartDataItem = {
  label: string;
  value: number;
};

export type DashboardStats = {
  completedWorkoutsCount: number;
  plannedWorkoutsCount: number;
  completionPercentage: number;
  workoutStreakCount: number;
  currentWeekNumber: number | null;
  currentWeekCompletedWorkoutsCount: number;
  currentWeekPlannedWorkoutsCount: number;
  completedWorkoutsChartData: DashboardChartDataItem[];
  currentWeekChartData: DashboardChartDataItem[];
  recentWorkoutActivity: DashboardChartDataItem[];
};

const getScheduledWorkouts = (
  workoutSchedule: WorkoutScheduleWeek[],
): ScheduledWorkout[] => {
  return workoutSchedule.flatMap((scheduleWeek) => scheduleWeek.workouts);
};

const isWorkoutCompleted = (
  scheduledWorkout: ScheduledWorkout,
  completedWorkoutKeys: Set<string>,
): boolean => {
  const workoutKey = createWorkoutKey(
    scheduledWorkout.scheduledDate,
    scheduledWorkout.workoutDay.dayNumber,
  );

  return completedWorkoutKeys.has(workoutKey);
};

const createRecentWorkoutActivity = (
  workoutSchedule: WorkoutScheduleWeek[],
  completedWorkoutKeys: Set<string>,
  today: string,
): DashboardChartDataItem[] => {
  return getScheduledWorkouts(workoutSchedule)
    .filter((scheduledWorkout) => scheduledWorkout.scheduledDate <= today)
    .sort((firstWorkout, secondWorkout) =>
      firstWorkout.scheduledDate.localeCompare(secondWorkout.scheduledDate),
    )
    .slice(-5)
    .map((scheduledWorkout) => ({
      label: weekDayLabels[scheduledWorkout.workoutDay.weekDay].slice(0, 3),
      value: isWorkoutCompleted(scheduledWorkout, completedWorkoutKeys) ? 1 : 0,
    }));
};

const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);

  newDate.setDate(newDate.getDate() + days);

  return newDate;
};

const formatShortDayLabel = (date: Date): string => {
  return date.toLocaleDateString("pl-PL", {
    weekday: "short",
  });
};

const getCompletedWorkoutKeys = (
  completedWorkouts: CompletedWorkout[],
): Set<string> => {
  return new Set(
    completedWorkouts.map((completedWorkout) =>
      createWorkoutKey(
        completedWorkout.scheduledDate,
        completedWorkout.workoutDayNumber,
      ),
    ),
  );
};

const getCurrentWeek = (
  workoutSchedule: WorkoutScheduleWeek[],
  today: string,
): WorkoutScheduleWeek | null => {
  return (
    workoutSchedule.find(
      (scheduleWeek) =>
        today >= scheduleWeek.weekStartDate &&
        today <= scheduleWeek.weekEndDate,
    ) ?? null
  );
};

const createCompletedWorkoutsChartData = (
  completedWorkouts: CompletedWorkout[],
  today: Date,
): DashboardChartDataItem[] => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(today, index - 6);

    const formattedDate = formatDateToISO(date);

    const completedCount = completedWorkouts.filter(
      (completedWorkout) => completedWorkout.completedDate === formattedDate,
    ).length;

    return {
      label: formatShortDayLabel(date),
      value: completedCount,
    };
  });
};

const createCurrentWeekChartData = (
  currentWeek: WorkoutScheduleWeek | null,
  completedWorkoutKeys: Set<string>,
): DashboardChartDataItem[] => {
  if (!currentWeek) {
    return [
      {
        label: "Wykonane",
        value: 0,
      },
      {
        label: "Pozostałe",
        value: 0,
      },
    ];
  }

  const completedCount = currentWeek.workouts.filter((scheduledWorkout) =>
    isWorkoutCompleted(scheduledWorkout, completedWorkoutKeys),
  ).length;

  const remainingCount = currentWeek.workouts.length - completedCount;

  return [
    {
      label: "Wykonane",
      value: completedCount,
    },
    {
      label: "Pozostałe",
      value: remainingCount,
    },
  ];
};

const getWorkoutStreakCount = (
  workoutSchedule: WorkoutScheduleWeek[],
  completedWorkoutKeys: Set<string>,
  today: string,
): number => {
  const pastWorkouts = getScheduledWorkouts(workoutSchedule)
    .filter((scheduledWorkout) => scheduledWorkout.scheduledDate <= today)
    .sort((firstWorkout, secondWorkout) =>
      secondWorkout.scheduledDate.localeCompare(firstWorkout.scheduledDate),
    );

  let streakCount = 0;

  for (const scheduledWorkout of pastWorkouts) {
    if (!isWorkoutCompleted(scheduledWorkout, completedWorkoutKeys)) {
      break;
    }

    streakCount += 1;
  }

  return streakCount;
};

export const createDashboardStats = ({
  workoutSchedule,
  completedWorkouts,
}: CreateDashboardStatsInput): DashboardStats => {
  const todayDate = new Date();
  const today = formatDateToISO(todayDate);

  const completedWorkoutKeys = getCompletedWorkoutKeys(completedWorkouts);

  const plannedWorkoutsCount = workoutSchedule.reduce(
    (total, scheduleWeek) => total + scheduleWeek.workouts.length,
    0,
  );

  const completedWorkoutsCount = completedWorkouts.length;

  const completionPercentage =
    plannedWorkoutsCount > 0
      ? Math.round((completedWorkoutsCount / plannedWorkoutsCount) * 100)
      : 0;

  const currentWeek = getCurrentWeek(workoutSchedule, today);

  const currentWeekCompletedWorkoutsCount = currentWeek
    ? currentWeek.workouts.filter((scheduledWorkout) =>
        isWorkoutCompleted(scheduledWorkout, completedWorkoutKeys),
      ).length
    : 0;

  const workoutStreakCount = getWorkoutStreakCount(
    workoutSchedule,
    completedWorkoutKeys,
    today,
  );

  return {
    completedWorkoutsCount,
    plannedWorkoutsCount,
    completionPercentage,
    workoutStreakCount,
    currentWeekNumber: currentWeek?.weekNumber ?? null,
    currentWeekCompletedWorkoutsCount,
    currentWeekPlannedWorkoutsCount: currentWeek?.workouts.length ?? 0,
    completedWorkoutsChartData: createCompletedWorkoutsChartData(
      completedWorkouts,
      todayDate,
    ),
    currentWeekChartData: createCurrentWeekChartData(
      currentWeek,
      completedWorkoutKeys,
    ),
    recentWorkoutActivity: createRecentWorkoutActivity(
      workoutSchedule,
      completedWorkoutKeys,
      today,
    ),
  };
};
