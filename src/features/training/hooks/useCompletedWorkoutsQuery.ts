import { useQuery } from "@tanstack/react-query";

import { getCompletedWorkoutsForPlan } from "../service/completedWorkoutService";

export const completedWorkoutsQueryKey = (
  uid: string,
  workoutPlanId: string,
) => ["completedWorkouts", uid, workoutPlanId];

export const useCompletedWorkoutsQuery = (
  uid: string,
  workoutPlanId: string,
) => {
  return useQuery({
    queryKey: completedWorkoutsQueryKey(uid, workoutPlanId),

    queryFn: () => getCompletedWorkoutsForPlan(uid, workoutPlanId),

    enabled: Boolean(uid && workoutPlanId),
  });
};
