import { useEffect, useState } from "react";

import {
  getExercises,
  type FirestoreExercise,
} from "../training/service/exerciseService";

export const useAdminExercises = () => {
  const [exercises, setExercises] = useState<FirestoreExercise[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExercises = async () => {
      try {
        setError("");
        const exercisesData = await getExercises();
        setExercises(exercisesData);
      } catch {
        setError("Nie udało się pobrać ćwiczeń.");
      } 
    };

    loadExercises();
  }, []);

  return {
    exercises,
    error,
  };
};