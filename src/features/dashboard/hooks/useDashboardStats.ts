import { useQuery } from "@tanstack/react-query";

import { getCompletedWorkoutsForPlan } from "../../training/service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";

import { createDashboardStats } from "../utils/dashboardStats";
import { createWorkoutSchedule } from "../../training/utils/workoutSchedule";

const getDashboardStats = async (uid: string) => {
  const activePlan = await getActiveWorkoutPlan(uid);

  if (!activePlan) {
    return null;
  }

  const completedWorkouts = await getCompletedWorkoutsForPlan(
    uid,
    activePlan.id,
  );

  const workoutSchedule = createWorkoutSchedule(activePlan);

  return createDashboardStats({
    workoutSchedule,
    completedWorkouts,
  });
};

export const useDashboardStats = (uid: string) => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboardStats", uid],

    queryFn: () => getDashboardStats(uid),

    enabled: Boolean(uid),
  });

  return {
    isLoading: isPending,
    errorMessage: isError ? "Nie udało się pobrać statystyk dashboardu." : "",
    stats: data ?? null,
  };
};
