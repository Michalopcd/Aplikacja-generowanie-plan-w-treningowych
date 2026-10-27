import { useAuth } from "../../auth/AuthContext";

import { useActiveWorkoutPlanQuery } from "./useActiveWorkoutPlanQuery";
import { useCompletedWorkoutsQuery } from "./useCompletedWorkoutsQuery";

export const useWorkoutHistory = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const uid = user?.uid ?? "";

  const {
    data: plan,
    isPending: isPlanPending,
    isError: isPlanError,
  } = useActiveWorkoutPlanQuery(uid);

  const {
    data: completedWorkouts = [],
    isPending: isCompletedWorkoutsPending,
    isError: isCompletedWorkoutsError,
  } = useCompletedWorkoutsQuery(uid, plan?.id ?? "");

  const sortedCompletedWorkouts = [...completedWorkouts].sort(
    (firstWorkout, secondWorkout) =>
      secondWorkout.completedAt.getTime() - firstWorkout.completedAt.getTime(),
  );

  const isLoading =
    isAuthLoading ||
    (Boolean(uid) && isPlanPending) ||
    (Boolean(plan) && isCompletedWorkoutsPending);

  const errorMessage =
    isPlanError || isCompletedWorkoutsError
      ? "Nie udało się pobrać historii treningów."
      : "";

  return {
    plan: plan ?? null,
    completedWorkouts: sortedCompletedWorkouts,
    isLoading,
    errorMessage,
  };
};
