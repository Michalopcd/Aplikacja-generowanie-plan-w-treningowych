import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";

import type { Exercise } from "../trainingPlan";

const EXERCISES_COLLECTION = "exercises";

export type FirestoreExercise = Exercise & {
  isActive: boolean;
};

export type CreateExerciseInput = Omit<
  FirestoreExercise,
  "id" | "isActive"
>;

export const getExercises =
  async (): Promise<FirestoreExercise[]> => {
    const snapshot = await getDocs(
      collection(db, EXERCISES_COLLECTION),
    );

    return snapshot.docs.map(
      (exerciseDocument) => {
        const data = exerciseDocument.data();

        return {
          id: exerciseDocument.id,
          name: data.name,
          trainingLocations:
            data.trainingLocations,
          muscleGroups: data.muscleGroups,
          experienceLevels:
            data.experienceLevels,
          isActive: data.isActive,
        } as FirestoreExercise;
      },
    );
  };

export const getActiveExercises =
  async (): Promise<Exercise[]> => {
    const exercises = await getExercises();

    return exercises.filter(
      (exercise) => exercise.isActive,
    );
  };

export const addExercise = async (
  exercise: CreateExerciseInput,
): Promise<string> => {
  const exerciseDocument = await addDoc(
    collection(db, EXERCISES_COLLECTION),
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
  const exerciseRef = doc(
    db,
    EXERCISES_COLLECTION,
    exerciseId,
  );

  await updateDoc(exerciseRef, {
    ...exercise,
  });
};

export const deactivateExercise = async (
  exerciseId: string,
): Promise<void> => {
  const exerciseRef = doc(
    db,
    EXERCISES_COLLECTION,
    exerciseId,
  );

  await updateDoc(exerciseRef, {
    isActive: false,
  });
};

export const activateExercise = async (
  exerciseId: string,
): Promise<void> => {
  const exerciseRef = doc(
    db,
    EXERCISES_COLLECTION,
    exerciseId,
  );

  await updateDoc(exerciseRef, {
    isActive: true,
  });
};