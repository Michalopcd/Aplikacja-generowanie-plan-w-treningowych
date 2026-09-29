import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getExercises,
  type FirestoreExercise,
} from "../../training/service/exerciseService";

export const useAdminExercises = () => {
  const [exercises, setExercises] = useState<
    FirestoreExercise[]
  >([]);

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
    loadExercises();
  }, [loadExercises]);

  return {
    exercises,
    isLoading,
    error,
    loadExercises,
  };
};