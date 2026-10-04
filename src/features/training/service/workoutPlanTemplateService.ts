import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";

import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";


const WORKOUT_PLAN_TEMPLATES_COLLECTION = "workoutPlanTemplates";

export const getWorkoutPlanTemplates = async (): Promise<
  WorkoutPlanTemplate[]
> => {
  const querySnapshot = await getDocs(
    collection(db, WORKOUT_PLAN_TEMPLATES_COLLECTION),
  );

  return querySnapshot.docs.map(
    (templateDoc) => templateDoc.data() as WorkoutPlanTemplate,
  );
};



export const updateWorkoutPlanTemplate = async (
  template: WorkoutPlanTemplate,
): Promise<void> => {
  await updateDoc(doc(db, WORKOUT_PLAN_TEMPLATES_COLLECTION, template.id), {
    trainingDaysPerWeek: template.trainingDaysPerWeek,
    workoutDays: template.workoutDays,
    isActive: template.isActive,
  });
};

export const getWorkoutPlanTemplate = async (
  trainingDaysPerWeek: number,
): Promise<WorkoutPlanTemplate | null> => {
  const templateRef = doc(
    db,
    WORKOUT_PLAN_TEMPLATES_COLLECTION,
    `${trainingDaysPerWeek}-days`,
  );

  const templateSnapshot = await getDoc(templateRef);

  if (!templateSnapshot.exists()) {
    return null;
  }

  return templateSnapshot.data() as WorkoutPlanTemplate;
};
