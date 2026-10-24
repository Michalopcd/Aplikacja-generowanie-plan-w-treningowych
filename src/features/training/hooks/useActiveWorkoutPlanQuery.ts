import { useQuery } from "@tanstack/react-query";

import { getActiveWorkoutPlan } from "../service/workoutPlanService";

export const activeWorkoutPlanQueryKey = (uid: string) => [
  "activeWorkoutPlan",
  uid,
];

export const useActiveWorkoutPlanQuery = (uid: string) => {
  return useQuery({
    queryKey: activeWorkoutPlanQueryKey(uid),

    queryFn: () => getActiveWorkoutPlan(uid),

    enabled: Boolean(uid),
  });
};
