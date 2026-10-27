import { useActiveWorkoutPlanQuery } from "../../training/hooks/useActiveWorkoutPlanQuery";
import { useCompletedWorkoutsQuery } from "../../training/hooks/useCompletedWorkoutsQuery";

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

export const useDashboardWorkoutReminder = (
  uid: string,
): DashboardWorkoutReminderState => {
  const today = formatDateToISO(new Date());

  const {
    data: activePlan,
    isPending: isPlanPending,
    isError: isPlanError,
  } = useActiveWorkoutPlanQuery(uid);

  const workoutSchedule = activePlan ? createWorkoutSchedule(activePlan) : [];

  const todayWorkout = findWorkoutForDate(workoutSchedule, today);

  const {
    data: completedWorkouts = [],
    isPending: isCompletedWorkoutsPending,
    isError: isCompletedWorkoutsError,
  } = useCompletedWorkoutsQuery(
    uid,
    todayWorkout ? (activePlan?.id ?? "") : "",
  );

  if (!uid) {
    return {
      isLoading: false,
      errorMessage: "",
      status: "no-active-plan",
      todayWorkout: null,
    };
  }

  const isLoading =
    isPlanPending || (Boolean(todayWorkout) && isCompletedWorkoutsPending);

  const errorMessage =
    isPlanError || isCompletedWorkoutsError
      ? "Nie udało się pobrać informacji o dzisiejszym treningu."
      : "";

  if (isLoading) {
    return {
      isLoading: true,
      errorMessage: "",
      status: "no-active-plan",
      todayWorkout: null,
    };
  }

  if (errorMessage) {
    return {
      isLoading: false,
      errorMessage,
      status: "no-active-plan",
      todayWorkout: null,
    };
  }

  if (!activePlan) {
    return {
      isLoading: false,
      errorMessage: "",
      status: "no-active-plan",
      todayWorkout: null,
    };
  }

  if (!todayWorkout) {
    return {
      isLoading: false,
      errorMessage: "",
      status: "no-workout-today",
      todayWorkout: null,
    };
  }

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
    isLoading: false,
    errorMessage: "",
    status: isTodayWorkoutCompleted ? "workout-completed" : "workout-to-do",
    todayWorkout,
  };
};
