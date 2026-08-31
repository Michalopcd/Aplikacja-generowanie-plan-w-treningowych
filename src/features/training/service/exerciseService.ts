import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc
} from "firebase/firestore";

import { db } from "../../../firebase";
import type { Exercise } from "../trainingPlan";
export type FirestoreExercise = Exercise & {
  isActive: boolean;
};
export type CreateExerciseInput = Omit<
  FirestoreExercise,
  "id" | "isActive"
>;
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
export const addExercise = async (
  exercise: CreateExerciseInput,
): Promise<string> => {
  const exerciseDocument = await addDoc(
    collection(db, "exercises"),
    {
      ...exercise,
      isActive: true,
    },
  );

  return exerciseDocument.id;
};
export const updateExercise = async (
  exerciseId: string,
  exercise: CreateExerciseInput,
): Promise<void> => {
  const exerciseRef = doc(db, "exercises", exerciseId);

  await updateDoc(exerciseRef, {
    ...exercise,
  });
};