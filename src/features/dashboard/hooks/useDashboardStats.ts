import { useActiveWorkoutPlanQuery } from "../../training/hooks/useActiveWorkoutPlanQuery";
import { useCompletedWorkoutsQuery } from "../../training/hooks/useCompletedWorkoutsQuery";

import { createWorkoutSchedule } from "../../training/utils/workoutSchedule";
import { createDashboardStats } from "../utils/dashboardStats";

export const useDashboardStats = (uid: string) => {
  const {
    data: activePlan,
    isPending: isPlanPending,
    isError: isPlanError,
  } = useActiveWorkoutPlanQuery(uid);

  const {
    data: completedWorkouts = [],
    isPending: isCompletedWorkoutsPending,
    isError: isCompletedWorkoutsError,
  } = useCompletedWorkoutsQuery(uid, activePlan?.id ?? "");

  const workoutSchedule = activePlan ? createWorkoutSchedule(activePlan) : null;

  const stats =
    workoutSchedule && activePlan
      ? createDashboardStats({
          workoutSchedule,
          completedWorkouts,
        })
      : null;

  const isLoading =
    (Boolean(uid) && isPlanPending) ||
    (Boolean(activePlan) && isCompletedWorkoutsPending);

  const errorMessage =
    isPlanError || isCompletedWorkoutsError
      ? "Nie udało się pobrać statystyk dashboardu."
      : "";

  return {
    isLoading,
    errorMessage,
    stats,
  };
};
