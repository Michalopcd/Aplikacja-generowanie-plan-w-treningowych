import { useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthContext";

import { getCompletedWorkoutsForPlan } from "../service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../service/workoutPlanService";

import type { CompletedWorkout } from "../completedWorkout";
import type { WorkoutPlan } from "../trainingPlan";

export const useProgressData = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);

  const [isProgressLoading, setIsProgressLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadProgressData = async () => {
      if (!user?.uid) {
        setPlan(null);
        setCompletedWorkouts([]);
        setIsProgressLoading(false);

        return;
      }

      setIsProgressLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        if (!activePlan) {
          setPlan(null);
          setCompletedWorkouts([]);

          return;
        }

        const userCompletedWorkouts = await getCompletedWorkoutsForPlan(
          user.uid,
          activePlan.id,
        );

        setPlan(activePlan);
        setCompletedWorkouts(userCompletedWorkouts);
      } catch {
        setErrorMessage("Nie udało się pobrać statystyk postępów.");
      } finally {
        setIsProgressLoading(false);
      }
    };

    loadProgressData();
  }, [user?.uid]);

  return {
    plan,
    completedWorkouts,
    isLoading: isAuthLoading || isProgressLoading,
    errorMessage,
  };
};
