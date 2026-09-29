import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase";
import type { WorkoutPlan } from "../trainingPlan";
import type { TrainingProfile } from "../../onboarding/types/onboarding";

const WORKOUT_PLANS_COLLECTION = "workoutPlans";

type ReplaceWorkoutPlanInput = {
  uid: string;
  trainingProfile: TrainingProfile;
  activePlanId?: string;
  newPlan: WorkoutPlan;
};
export class ActiveWorkoutPlanNotFoundError extends Error {
  constructor() {
    super("Nie znaleziono aktywnego planu treningowego.");
    this.name = "ActiveWorkoutPlanNotFoundError";
  }
}

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
export const archiveWorkoutPlan = async (
  workoutPlanId: string,
): Promise<void> => {
  await updateDoc(
    doc(db, WORKOUT_PLANS_COLLECTION, workoutPlanId),
    {
      status: "archived",
      updatedAt: new Date(),
    },
  );
};
export const replaceWorkoutPlan = async ({
  uid,
  trainingProfile,
  activePlanId,
  newPlan,
}: ReplaceWorkoutPlanInput): Promise<void> => {
  const batch = writeBatch(db);

  const userRef = doc(db, "users", uid);

  batch.update(userRef, {
    trainingProfile,
  });

  if (activePlanId) {
    const activePlanRef = doc(
      db,
      WORKOUT_PLANS_COLLECTION,
      activePlanId,
    );

    batch.update(activePlanRef, {
      status: "archived",
      updatedAt: new Date(),
    });
  }

  const newPlanRef = doc(
    db,
    WORKOUT_PLANS_COLLECTION,
    newPlan.id,
  );

  batch.set(newPlanRef, newPlan);

  await batch.commit();
};