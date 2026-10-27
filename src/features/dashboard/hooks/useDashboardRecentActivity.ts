import { useActiveWorkoutPlanQuery } from "../../training/hooks/useActiveWorkoutPlanQuery";
import { useCompletedWorkoutsQuery } from "../../training/hooks/useCompletedWorkoutsQuery";

import type { TrainingGoal } from "../../onboarding/types/onboarding";

type DashboardRecentActivityItem = {
  id: string;
  workoutDayName: string;
  weekNumber: number;
  completedDate: string;
  exerciseCount: number;
  goal: TrainingGoal;
};

type DashboardRecentActivityStatus = "no-active-plan" | "empty" | "ready";

type DashboardRecentActivityState = {
  isLoading: boolean;
  errorMessage: string;
  status: DashboardRecentActivityStatus;
  activities: DashboardRecentActivityItem[];
};

const RECENT_ACTIVITIES_LIMIT = 4;

export const useDashboardRecentActivity = (
  uid: string,
): DashboardRecentActivityState => {
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

  if (!uid) {
    return {
      isLoading: false,
      errorMessage: "",
      status: "empty",
      activities: [],
    };
  }

  const recentActivities = [...completedWorkouts]
    .sort(
      (firstWorkout, secondWorkout) =>
        secondWorkout.completedAt.getTime() -
        firstWorkout.completedAt.getTime(),
    )
    .slice(0, RECENT_ACTIVITIES_LIMIT)
    .map((completedWorkout) => ({
      id: completedWorkout.id,
      workoutDayName: completedWorkout.workoutDayName,
      weekNumber: completedWorkout.weekNumber,
      completedDate: completedWorkout.completedDate,
      exerciseCount: completedWorkout.exerciseCount,
      goal: completedWorkout.goal,
    }));

  const isLoading =
    isPlanPending || (Boolean(activePlan) && isCompletedWorkoutsPending);

  const errorMessage =
    isPlanError || isCompletedWorkoutsError
      ? "Nie udało się pobrać ostatnich aktywności."
      : "";

  const status: DashboardRecentActivityStatus = !activePlan
    ? "no-active-plan"
    : recentActivities.length > 0
      ? "ready"
      : "empty";

  return {
    isLoading,
    errorMessage,
    status,
    activities: recentActivities,
  };
};
