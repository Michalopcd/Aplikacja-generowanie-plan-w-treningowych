import { useEffect, useState } from "react";

import { getCompletedWorkoutsForPlan } from "../../training/service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";
import { createWorkoutSchedule } from "../../training/utils/workoutSchedule";
import {
  createDashboardStats,
  type DashboardStats,
} from "../utils/dashboardStats";

type DashboardStatsState = {
  isLoading: boolean;
  errorMessage: string;
  stats: DashboardStats | null;
};

export const useDashboardStats = (
  uid: string,
): DashboardStatsState => {
  const [state, setState] = useState<DashboardStatsState>({
    isLoading: true,
    errorMessage: "",
    stats: null,
  });

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (!uid) {
        setState({
          isLoading: false,
          errorMessage: "",
          stats: null,
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
            stats: null,
          });

          return;
        }

        const completedWorkouts = await getCompletedWorkoutsForPlan(
          uid,
          activePlan.id,
        );

        const workoutSchedule = createWorkoutSchedule(activePlan);

        const stats = createDashboardStats({
          workoutSchedule,
          completedWorkouts,
        });

        setState({
          isLoading: false,
          errorMessage: "",
          stats,
        });
      } catch (error) {
        console.error(error);

        setState({
          isLoading: false,
          errorMessage:
            "Nie udało się pobrać statystyk dashboardu.",
          stats: null,
        });
      }
    };

    loadDashboardStats();
  }, [uid]);

  return state;
};