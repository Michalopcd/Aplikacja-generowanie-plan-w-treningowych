import { useEffect, useState } from "react";

import { getCompletedWorkoutsForPlan } from "../../training/service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";
import { formatDateToISO } from "../../training/utils/dateUtils";
import { createWorkoutKey } from "../../training/utils/workoutKey";
import {
  createWorkoutSchedule,
  type ScheduledWorkout,
  type WorkoutScheduleWeek,
} from "../../training/utils/workoutSchedule";

export type DashboardWorkoutReminderStatus =
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
      .find(
        (scheduledWorkout) =>
          scheduledWorkout.scheduledDate === date,
      ) ?? null
  );
};

export const useDashboardWorkoutReminder = (
  uid: string,
): DashboardWorkoutReminderState => {
  const [state, setState] = useState<DashboardWorkoutReminderState>({
    isLoading: true,
    errorMessage: "",
    status: "no-active-plan",
    todayWorkout: null,
  });

  useEffect(() => {
    const loadWorkoutReminder = async () => {
      if (!uid) {
        setState({
          isLoading: false,
          errorMessage: "",
          status: "no-active-plan",
          todayWorkout: null,
        });

        return;
      }

      setState((currentState) => ({
        ...currentState,
        isLoading: true,
        errorMessage: "",
      }));

      try {
        const activePlan = await getActiveWorkoutPlan(uid);

        if (!activePlan) {
          setState({
            isLoading: false,
            errorMessage: "",
            status: "no-active-plan",
            todayWorkout: null,
          });

          return;
        }

        const today = formatDateToISO(new Date());
        const workoutSchedule = createWorkoutSchedule(activePlan);

        const todayWorkout = findWorkoutForDate(
          workoutSchedule,
          today,
        );

        if (!todayWorkout) {
          setState({
            isLoading: false,
            errorMessage: "",
            status: "no-workout-today",
            todayWorkout: null,
          });

          return;
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

        setState({
          isLoading: false,
          errorMessage: "",
          status: isTodayWorkoutCompleted
            ? "workout-completed"
            : "workout-to-do",
          todayWorkout,
        });
      } catch (error) {
        console.error(error);

        setState({
          isLoading: false,
          errorMessage:
            "Nie udało się pobrać informacji o dzisiejszym treningu.",
          status: "no-active-plan",
          todayWorkout: null,
        });
      }
    };

    loadWorkoutReminder();
  }, [uid]);

  return state;
};