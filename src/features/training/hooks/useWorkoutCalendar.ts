import { useAuth } from "../../auth/AuthContext";

import { updateWorkoutScheduleOverride } from "../service/workoutPlanService";

import { createWorkoutKey } from "../utils/workoutKey";

import { useActiveWorkoutPlanQuery } from "./useActiveWorkoutPlanQuery";
import { useCompletedWorkoutsQuery } from "./useCompletedWorkoutsQuery";

type UpdateWorkoutDateInput = {
  weekNumber: number;
  workoutDayNumber: number;
  scheduledDate: string;
};

export const useWorkoutCalendar = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const uid = user?.uid ?? "";

  const {
    data: plan,
    isLoading: isPlanLoading,
    error: planError,
    refetch: refetchPlan,
  } = useActiveWorkoutPlanQuery(uid);

  const {
    data: completedWorkouts = [],
    isLoading: isCompletedWorkoutsLoading,
    error: completedWorkoutsError,
  } = useCompletedWorkoutsQuery(uid, plan?.id ?? "");

  const completedWorkoutKeys = new Set(
    completedWorkouts.map((completedWorkout) =>
      createWorkoutKey(
        completedWorkout.scheduledDate,
        completedWorkout.workoutDayNumber,
      ),
    ),
  );

  const updateWorkoutDate = async ({
    weekNumber,
    workoutDayNumber,
    scheduledDate,
  }: UpdateWorkoutDateInput) => {
    if (!user?.uid || !plan) {
      return;
    }

    await updateWorkoutScheduleOverride({
      plan,
      weekNumber,
      workoutDayNumber,
      scheduledDate,
    });

    await refetchPlan();
  };

  const isLoading =
    isAuthLoading ||
    (Boolean(uid) && isPlanLoading) ||
    (Boolean(plan) && isCompletedWorkoutsLoading);

  const errorMessage =
    planError || completedWorkoutsError
      ? "Nie udało się pobrać kalendarza treningów."
      : "";

  return {
    plan: plan ?? null,
    completedWorkoutKeys,
    isLoading,
    errorMessage,
    updateWorkoutDate,
  };
};
