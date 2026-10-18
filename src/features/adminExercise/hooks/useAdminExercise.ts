import { useCallback, useEffect, useState } from "react";

import { getExercises } from "../../training/service/exerciseService";

import type { FirestoreExercise } from "../../training/service/exerciseService";

export const useAdminExercises = () => {
  const [exercises, setExercises] = useState<FirestoreExercise[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadExercises = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const exercisesData = await getExercises();

      setExercises(exercisesData);
    } catch {
      setError("Nie udało się pobrać ćwiczeń.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialExercises = async () => {
      try {
        const exercisesData = await getExercises();

        setExercises(exercisesData);
      } catch {
        setError("Nie udało się pobrać ćwiczeń.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialExercises();
  }, []);

  return {
    exercises,
    isLoading,
    error,
    loadExercises,
  };
};
