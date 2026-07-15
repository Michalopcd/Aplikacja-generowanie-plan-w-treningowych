import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase";
import type { WorkoutPlan } from "../trainingPlan";

const WORKOUT_PLANS_COLLECTION = "workoutPlans";

type FirestoreWorkoutPlan = Omit<
  WorkoutPlan,
  "createdAt" | "updatedAt"
> & {
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

const convertFirestoreDate = (date: Timestamp | Date): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }

  return date;
};

const mapWorkoutPlanFromFirestore = (
  workoutPlan: FirestoreWorkoutPlan,
): WorkoutPlan => {
  return {
    ...workoutPlan,
    createdAt: convertFirestoreDate(workoutPlan.createdAt),
    updatedAt: convertFirestoreDate(workoutPlan.updatedAt),
  };
};

export const saveWorkoutPlan = async (
  workoutPlan: WorkoutPlan,
): Promise<void> => {
  await setDoc(
    doc(db, WORKOUT_PLANS_COLLECTION, workoutPlan.id),
    workoutPlan,
  );
};

export const getActiveWorkoutPlan = async (
  uid: string,
): Promise<WorkoutPlan | null> => {
  const activePlanQuery = query(
    collection(db, WORKOUT_PLANS_COLLECTION),
    where("uid", "==", uid),
    where("status", "==", "active"),
    limit(1),
  );

  const querySnapshot = await getDocs(activePlanQuery);

  if (querySnapshot.empty) {
    return null;
  }

  const workoutPlan = querySnapshot.docs[0].data() as FirestoreWorkoutPlan;

  return mapWorkoutPlanFromFirestore(workoutPlan);
};