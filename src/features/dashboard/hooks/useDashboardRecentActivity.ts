import { useEffect, useState } from "react";

import { getCompletedWorkoutsForPlan } from "../../training/service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";
import type { TrainingGoal } from "../../onboarding/types/onboarding";

export type DashboardRecentActivityItem = {
  id: string;
  workoutDayName: string;
  weekNumber: number;
  completedDate: string;
  exerciseCount: number;
  goal: TrainingGoal;
};

type DashboardRecentActivityStatus =
  | "no-active-plan"
  | "empty"
  | "ready";

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
  const [state, setState] = useState<DashboardRecentActivityState>({
    isLoading: true,
    errorMessage: "",
    status: "empty",
    activities: [],
  });

  useEffect(() => {
    const loadRecentActivity = async () => {
      if (!uid) {
        setState({
          isLoading: false,
          errorMessage: "",
          status: "empty",
          activities: [],
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
            activities: [],
          });

          return;
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

        setState({
          isLoading: false,
          errorMessage: "",
          status:
            recentActivities.length > 0 ? "ready" : "empty",
          activities: recentActivities,
        });
      } catch (error) {
        console.error(error);

        setState({
          isLoading: false,
          errorMessage:
            "Nie udało się pobrać ostatniej aktywności.",
          status: "empty",
          activities: [],
        });
      }
    };

    loadRecentActivity();
  }, [uid]);

  return state;
};