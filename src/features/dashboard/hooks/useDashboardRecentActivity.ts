import { useQuery } from "@tanstack/react-query";

import { getCompletedWorkoutsForPlan } from "../../training/service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";

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

type DashboardRecentActivityData = {
  status: DashboardRecentActivityStatus;
  activities: DashboardRecentActivityItem[];
};

type DashboardRecentActivityState = {
  isLoading: boolean;
  errorMessage: string;
  status: DashboardRecentActivityStatus;
  activities: DashboardRecentActivityItem[];
};

const RECENT_ACTIVITIES_LIMIT = 4;

const getDashboardRecentActivity = async (
  uid: string,
): Promise<DashboardRecentActivityData> => {
  const activePlan = await getActiveWorkoutPlan(uid);

  if (!activePlan) {
    return {
      status: "no-active-plan",
      activities: [],
    };
  }

  const completedWorkouts = await getCompletedWorkoutsForPlan(
    uid,
    activePlan.id,
  );

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

  return {
    status: recentActivities.length > 0 ? "ready" : "empty",
    activities: recentActivities,
  };
};

export const useDashboardRecentActivity = (
  uid: string,
): DashboardRecentActivityState => {
  const { data, isPending, isError } = useQuery({
    queryKey: ["dashboardRecentActivity", uid],

    queryFn: () => getDashboardRecentActivity(uid),

    enabled: Boolean(uid),
  });

  if (!uid) {
    return {
      isLoading: false,
      errorMessage: "",
      status: "empty",
      activities: [],
    };
  }

  return {
    isLoading: isPending,

    errorMessage: isError ? "Nie udało się pobrać ostatnich aktywności." : "",

    status: data?.status ?? "empty",

    activities: data?.activities ?? [],
  };
};
