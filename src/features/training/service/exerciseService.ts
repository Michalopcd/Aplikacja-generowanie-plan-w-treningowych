import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../../../firebase";
import type { Exercise } from "../trainingPlan";
export type FirestoreExercise = Exercise & {
  isActive: boolean;
};

export const getExercises = async (): Promise<FirestoreExercise[]> => {
  const snapshot = await getDocs(collection(db, "exercises"));

  return snapshot.docs.map((exerciseDocument) => {
    const data = exerciseDocument.data();

    return {
      id: exerciseDocument.id,
      name: data.name,
      trainingLocations: data.trainingLocations,
      muscleGroups: data.muscleGroups,
      experienceLevels: data.experienceLevels,
      isActive: data.isActive,
    } as FirestoreExercise;
  });
};
