import { useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthContext";

import { getCompletedWorkoutsForPlan } from "../service/completedWorkoutService";
import { getActiveWorkoutPlan } from "../service/workoutPlanService";

import type { CompletedWorkout } from "../completedWorkout";
import type { WorkoutPlan } from "../trainingPlan";

export const useWorkoutHistory = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const [completedWorkouts, setCompletedWorkouts] = useState<
    CompletedWorkout[]
  >([]);

  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadWorkoutHistory = async () => {
      if (!user?.uid) {
        setPlan(null);
        setCompletedWorkouts([]);
        setIsHistoryLoading(false);

        return;
      }

      setIsHistoryLoading(true);
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

        const sortedCompletedWorkouts = [...userCompletedWorkouts].sort(
          (firstWorkout, secondWorkout) =>
            secondWorkout.completedAt.getTime() -
            firstWorkout.completedAt.getTime(),
        );

        setPlan(activePlan);
        setCompletedWorkouts(sortedCompletedWorkouts);
      } catch {
        setErrorMessage("Nie udało się pobrać historii treningów.");
      } finally {
        setIsHistoryLoading(false);
      }
    };

    loadWorkoutHistory();
  }, [user?.uid]);

  return {
    plan,
    completedWorkouts,
    isLoading: isAuthLoading || isHistoryLoading,
    errorMessage,
  };
};
