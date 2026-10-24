import { useQuery } from "@tanstack/react-query";

import { getCompletedWorkoutsForPlan } from "../../training/service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";

import type {
  ScheduledWorkout,
  WorkoutScheduleWeek,
} from "../../training/utils/workoutSchedule";

import { formatDateToISO } from "../../training/utils/dateUtils";
import { createWorkoutKey } from "../../training/utils/workoutKey";
import { createWorkoutSchedule } from "../../training/utils/workoutSchedule";

type DashboardWorkoutReminderStatus =
  | "no-active-plan"
  | "no-workout-today"
  | "workout-to-do"
  | "workout-completed";

type DashboardWorkoutReminderData = {
  status: DashboardWorkoutReminderStatus;
  todayWorkout: ScheduledWorkout | null;
};

type DashboardWorkoutReminderState = {
  isLoading: boolean;
  errorMessage: string;
  status: DashboardWorkoutReminderStatus;
  todayWorkout: ScheduledWorkout | null;
};

const findWorkoutForDate = (
  workoutSchedule: WorkoutScheduleWeek[],
  date: string,
): ScheduledWorkout | null => {
  return (
    workoutSchedule
      .flatMap((scheduleWeek) => scheduleWeek.workouts)
      .find((scheduledWorkout) => scheduledWorkout.scheduledDate === date) ??
    null
  );
};

const getDashboardWorkoutReminder = async (
  uid: string,
  today: string,
): Promise<DashboardWorkoutReminderData> => {
  const activePlan = await getActiveWorkoutPlan(uid);

  if (!activePlan) {
    return {
      status: "no-active-plan",
      todayWorkout: null,
    };
  }

  const workoutSchedule = createWorkoutSchedule(activePlan);

  const todayWorkout = findWorkoutForDate(workoutSchedule, today);

  if (!todayWorkout) {
    return {
      status: "no-workout-today",
      todayWorkout: null,
    };
  }

  const completedWorkouts = await getCompletedWorkoutsForPlan(
    uid,
    activePlan.id,
  );

  const todayWorkoutKey = createWorkoutKey(
    todayWorkout.scheduledDate,
    todayWorkout.workoutDay.dayNumber,
  );

  const isTodayWorkoutCompleted = completedWorkouts.some(
    (completedWorkout) =>
      createWorkoutKey(
        completedWorkout.scheduledDate,
        completedWorkout.workoutDayNumber,
      ) === todayWorkoutKey,
  );

  return {
    status: isTodayWorkoutCompleted ? "workout-completed" : "workout-to-do",
    todayWorkout,
  };
};

export const useDashboardWorkoutReminder = (
  uid: string,
): DashboardWorkoutReminderState => {
  const today = formatDateToISO(new Date());

  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboardWorkoutReminder", uid, today],

    queryFn: () => getDashboardWorkoutReminder(uid, today),

    enabled: Boolean(uid),
  });

  if (!uid) {
    return {
      isLoading: false,
      errorMessage: "",
      status: "no-active-plan",
      todayWorkout: null,
    };
  }

  return {
    isLoading: isPending,

    errorMessage: isError
      ? "Nie udało się pobrać informacji o dzisiejszym treningu."
      : "",

    status: data?.status ?? "no-active-plan",

    todayWorkout: data?.todayWorkout ?? null,
  };
};
