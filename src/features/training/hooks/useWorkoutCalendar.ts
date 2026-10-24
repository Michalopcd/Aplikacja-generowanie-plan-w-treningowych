import { useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();

  const {
    data: plan,
    isPending: isPlanPending,
    isError: isPlanError,
  } = useActiveWorkoutPlanQuery(user?.uid ?? "");

  const {
    data: completedWorkouts = [],
    isPending: isCompletedWorkoutsPending,
    isError: isCompletedWorkoutsError,
  } = useCompletedWorkoutsQuery(user?.uid ?? "", plan?.id ?? "");

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

    const updatedPlan = await updateWorkoutScheduleOverride({
      plan,
      weekNumber,
      workoutDayNumber,
      scheduledDate,
    });

    queryClient.setQueryData(["activeWorkoutPlan", user.uid], updatedPlan);
  };

  const isLoading =
    isAuthLoading ||
    (Boolean(user?.uid) && isPlanPending) ||
    (Boolean(plan) && isCompletedWorkoutsPending);

  const errorMessage =
    isPlanError || isCompletedWorkoutsError
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
