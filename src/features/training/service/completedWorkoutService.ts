import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../../../firebase";
import type { TrainingGoal } from "../../onboarding/types/onboarding";
import type { CompletedWorkout } from "../completedWorkout";
import { formatDateToISO } from "../utils/dateUtils";

const COMPLETED_WORKOUTS_COLLECTION = "completedWorkouts";

type FirestoreCompletedWorkout = Omit<
  CompletedWorkout,
  "completedAt"
> & {
  completedAt: Timestamp | Date;
};

const convertFirestoreDate = (date: Timestamp | Date): Date => {
  if (date instanceof Timestamp) {
    return date.toDate();
  }

  return date;
};

type SaveCompletedWorkoutInput = {
  uid: string;
  workoutPlanId: string;
  workoutDayNumber: number;
  workoutDayName: string;
  weekNumber: number;
  trainingNumber: number;
  scheduledDate: string;
  goal: TrainingGoal;
  exerciseCount: number;
};

const createCompletedWorkoutId = (
  uid: string,
  workoutPlanId: string,
  scheduledDate: string,
  workoutDayNumber: number,
): string => {
  return `${uid}_${workoutPlanId}_${scheduledDate}_${workoutDayNumber}`;
};

export const getCompletedWorkoutsForPlan = async (
  uid: string,
  workoutPlanId: string,
): Promise<CompletedWorkout[]> => {
  const completedWorkoutsQuery = query(
    collection(db, COMPLETED_WORKOUTS_COLLECTION),
    where("uid", "==", uid),
  );

  const querySnapshot = await getDocs(completedWorkoutsQuery);

  return querySnapshot.docs
    .map((document) => {
      const completedWorkout =
        document.data() as FirestoreCompletedWorkout;

      return {
        ...completedWorkout,
        completedAt: convertFirestoreDate(
          completedWorkout.completedAt,
        ),
      };
    })
    .filter(
      (completedWorkout) =>
        completedWorkout.workoutPlanId === workoutPlanId,
    );
};
export const saveCompletedWorkout = async ({
  uid,
  workoutPlanId,
  workoutDayNumber,
  workoutDayName,
  weekNumber,
  trainingNumber,
  scheduledDate,
  goal,
  exerciseCount,
}: SaveCompletedWorkoutInput): Promise<void> => {
  const completedAt = new Date();
  const completedDate = formatDateToISO(completedAt);

  const completedWorkoutId = createCompletedWorkoutId(
    uid,
    workoutPlanId,
    scheduledDate,
    workoutDayNumber,
  );

  const completedWorkout: CompletedWorkout = {
    id: completedWorkoutId,
    uid,
    workoutPlanId,
    workoutDayNumber,
    workoutDayName,
    weekNumber,
    trainingNumber,
    scheduledDate,
    completedDate,
    completedAt,
    goal,
    exerciseCount,
  };

  await setDoc(
    doc(db, COMPLETED_WORKOUTS_COLLECTION, completedWorkoutId),
    completedWorkout,
  );
};
