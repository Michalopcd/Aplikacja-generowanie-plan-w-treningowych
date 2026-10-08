import { useEffect, useState } from "react";

import { useAuth } from "../../auth/AuthContext";

import { getCompletedWorkoutsForPlan } from "../service/completedWorkoutService";
import {
  getActiveWorkoutPlan,
  updateWorkoutScheduleOverride,
} from "../service/workoutPlanService";

import type { WorkoutPlan } from "../trainingPlan";

import { createWorkoutKey } from "../utils/workoutKey";

type UpdateWorkoutDateInput = {
  weekNumber: number;
  workoutDayNumber: number;
  scheduledDate: string;
};

export const useWorkoutCalendar = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const [completedWorkoutKeys, setCompletedWorkoutKeys] = useState<Set<string>>(
    new Set(),
  );

  const [isPlanLoading, setIsPlanLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadWorkoutCalendar = async () => {
      if (!user?.uid) {
        setPlan(null);
        setCompletedWorkoutKeys(new Set());
        setIsPlanLoading(false);

        return;
      }

      setIsPlanLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        if (!activePlan) {
          setPlan(null);
          setCompletedWorkoutKeys(new Set());

          return;
        }

        const completedWorkouts = await getCompletedWorkoutsForPlan(
          user.uid,
          activePlan.id,
        );

        const completedKeys = new Set(
          completedWorkouts.map((completedWorkout) =>
            createWorkoutKey(
              completedWorkout.scheduledDate,
              completedWorkout.workoutDayNumber,
            ),
          ),
        );

        setPlan(activePlan);
        setCompletedWorkoutKeys(completedKeys);
      } catch {
        setErrorMessage("Nie udało się pobrać kalendarza treningów.");
      } finally {
        setIsPlanLoading(false);
      }
    };

    loadWorkoutCalendar();
  }, [user?.uid]);

  const updateWorkoutDate = async ({
    weekNumber,
    workoutDayNumber,
    scheduledDate,
  }: UpdateWorkoutDateInput) => {
    if (!plan) {
      return;
    }

    const updatedPlan = await updateWorkoutScheduleOverride({
      plan,
      weekNumber,
      workoutDayNumber,
      scheduledDate,
    });

    setPlan(updatedPlan);
  };

  return {
    plan,
    completedWorkoutKeys,
    isLoading: isAuthLoading || isPlanLoading,
    errorMessage,
    updateWorkoutDate,
  };
};
