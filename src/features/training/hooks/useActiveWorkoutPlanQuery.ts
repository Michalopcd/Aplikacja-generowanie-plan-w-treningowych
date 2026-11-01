import { useCallback, useEffect, useState } from "react";

import { getActiveWorkoutPlan } from "../service/workoutPlanService";

import type { WorkoutPlan } from "../trainingPlan";

import { getActiveWorkoutPlanStorageKey } from "../constants/sessionStorageKeys";
import {
  getSessionStorageItem,
  removeSessionStorageItem,
  setSessionStorageItem,
} from "../../../utils/sessionStorage";

type StoredWorkoutPlan = Omit<WorkoutPlan, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

const restoreWorkoutPlan = (storedPlan: StoredWorkoutPlan): WorkoutPlan => {
  return {
    ...storedPlan,
    createdAt: new Date(storedPlan.createdAt),
    updatedAt: new Date(storedPlan.updatedAt),
  };
};

export const activeWorkoutPlanQueryKey = (uid: string) => [
  "activeWorkoutPlan",
  uid,
];

export const useActiveWorkoutPlanQuery = (uid: string) => {
  const [data, setData] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(uid));
  const [error, setError] = useState<Error | null>(null);

  const loadActiveWorkoutPlan = useCallback(
    async (forceRefresh = false) => {
      if (!uid) {
        setData(null);
        setIsLoading(false);

        return;
      }

      setIsLoading(true);
      setError(null);

      const storageKey = getActiveWorkoutPlanStorageKey(uid);

      try {
        if (!forceRefresh) {
          const storedPlan =
            getSessionStorageItem<StoredWorkoutPlan>(storageKey);

          if (storedPlan) {
            const restoredPlan = restoreWorkoutPlan(storedPlan);

            setData(restoredPlan);
            setIsLoading(false);

            return;
          }
        }

        const activePlan = await getActiveWorkoutPlan(uid);

        setData(activePlan);

        if (activePlan) {
          setSessionStorageItem(storageKey, activePlan);
        } else {
          removeSessionStorageItem(storageKey);
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error
            : new Error("Nie udało się pobrać aktywnego planu."),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [uid],
  );

  useEffect(() => {
    loadActiveWorkoutPlan();
  }, [loadActiveWorkoutPlan]);

  const refetch = useCallback(async () => {
    await loadActiveWorkoutPlan(true);
  }, [loadActiveWorkoutPlan]);

  return {
    data,
    isLoading,
    isPending: isLoading,
    error,
    isError: Boolean(error),
    refetch,
  };
};
