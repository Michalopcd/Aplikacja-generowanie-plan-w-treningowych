import { useEffect, useState,useCallback } from "react";

import {
  getExercises,
  type FirestoreExercise,
} from "../../training/service/exerciseService";

export const useAdminExercises = () => {
  const [exercises, setExercises] = useState<FirestoreExercise[]>([]);
  const [error, setError] = useState("");

  
  const loadExercises = useCallback(async () => {
    try {
      setError("");

      const exercisesData = await getExercises();

      setExercises(exercisesData);
    } catch {
      setError("Nie udało się pobrać ćwiczeń.");
    }
  }, []);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);


  return {
    exercises,
    error,
    loadExercises
  };
};