import { useCallback, useEffect, useState } from "react";

import { getCompletedWorkoutsForPlan } from "../service/completedWorkoutService";

import type { CompletedWorkout } from "../completedWorkout";

import { getCompletedWorkoutsStorageKey } from "../constants/sessionStorageKeys";
import {
  getSessionStorageItem,
  setSessionStorageItem,
} from "../../../utils/sessionStorage";

type StoredCompletedWorkout = Omit<CompletedWorkout, "completedAt"> & {
  completedAt: string;
};

const restoreCompletedWorkouts = (
  workouts: StoredCompletedWorkout[],
): CompletedWorkout[] => {
  return workouts.map((workout) => ({
    ...workout,
    completedAt: new Date(workout.completedAt),
  }));
};

export const completedWorkoutsQueryKey = (
  uid: string,
  workoutPlanId: string,
) => ["completedWorkouts", uid, workoutPlanId];

export const useCompletedWorkoutsQuery = (
  uid: string,
  workoutPlanId: string,
) => {
  const [data, setData] = useState<CompletedWorkout[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(Boolean(uid && workoutPlanId));
  const [error, setError] = useState<Error | null>(null);

  const loadCompletedWorkouts = useCallback(
    async (forceRefresh = false) => {
      if (!uid || !workoutPlanId) {
        setData(undefined);
        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      setError(null);

      const storageKey = getCompletedWorkoutsStorageKey(uid, workoutPlanId);

      try {
        if (!forceRefresh) {
          const storedWorkouts =
            getSessionStorageItem<StoredCompletedWorkout[]>(storageKey);

          if (storedWorkouts) {
            setData(restoreCompletedWorkouts(storedWorkouts));
            setIsLoading(false);

            return;
          }
        }

        const completedWorkouts = await getCompletedWorkoutsForPlan(
          uid,
          workoutPlanId,
        );

        setData(completedWorkouts);
        setSessionStorageItem(storageKey, completedWorkouts);
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("Nie udało się pobrać wykonanych treningów."),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [uid, workoutPlanId],
  );

  useEffect(() => {
    loadCompletedWorkouts();
  }, [loadCompletedWorkouts]);

  const refetch = async () => {
    await loadCompletedWorkouts(true);
  };

  return {
    data,
    isLoading,
    isPending: isLoading,
    error,
    isError: Boolean(error),
    refetch,
  };
};
