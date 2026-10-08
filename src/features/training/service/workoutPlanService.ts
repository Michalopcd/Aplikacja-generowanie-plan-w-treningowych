import {
  collection,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";

import { db } from "../../../firebase";

import type { TrainingProfile } from "../../onboarding/types/onboarding";
import type {
  WorkoutPlan,
  WorkoutScheduleOverride,
} from "../trainingPlan";

const WORKOUT_PLANS_COLLECTION = "workoutPlans";

type ReplaceWorkoutPlanInput = {
  uid: string;
  trainingProfile: TrainingProfile;
  activePlanId?: string;
  newPlan: WorkoutPlan;
};

type FirestoreWorkoutPlan = Omit<
  WorkoutPlan,
  "createdAt" | "updatedAt"
> & {
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
};

type UpdateWorkoutScheduleOverrideInput = {
  plan: WorkoutPlan;
  weekNumber: number;
  workoutDayNumber: number;
  scheduledDate: string;
};

const convertFirestoreDate = (
  date: Timestamp | Date,
): Date => {
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
    createdAt: convertFirestoreDate(
      workoutPlan.createdAt,
    ),
    updatedAt: convertFirestoreDate(
      workoutPlan.updatedAt,
    ),
  };
};

export const saveWorkoutPlan = async (
  workoutPlan: WorkoutPlan,
): Promise<void> => {
  await setDoc(
    doc(
      db,
      WORKOUT_PLANS_COLLECTION,
      workoutPlan.id,
    ),
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

  const querySnapshot =
    await getDocs(activePlanQuery);

  if (querySnapshot.empty) {
    return null;
  }

  const workoutPlanDocument =
    querySnapshot.docs[0];

  const workoutPlan = {
    ...workoutPlanDocument.data(),
    id: workoutPlanDocument.id,
  } as FirestoreWorkoutPlan;

  return mapWorkoutPlanFromFirestore(
    workoutPlan,
  );
};

export const updateWorkoutScheduleOverride = async ({
  plan,
  weekNumber,
  workoutDayNumber,
  scheduledDate,
}: UpdateWorkoutScheduleOverrideInput): Promise<WorkoutPlan> => {
  const scheduleOverride: WorkoutScheduleOverride = {
    weekNumber,
    workoutDayNumber,
    scheduledDate,
  };

  const currentOverrides =
    plan.scheduleOverrides ?? [];

  const updatedOverrides = [
    ...currentOverrides.filter(
      (override) =>
        !(
          override.weekNumber === weekNumber &&
          override.workoutDayNumber ===
            workoutDayNumber
        ),
    ),
    scheduleOverride,
  ];

  const updatedAt = new Date();

  await updateDoc(
    doc(
      db,
      WORKOUT_PLANS_COLLECTION,
      plan.id,
    ),
    {
      scheduleOverrides: updatedOverrides,
      updatedAt,
    },
  );

  return {
    ...plan,
    scheduleOverrides: updatedOverrides,
    updatedAt,
  };
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