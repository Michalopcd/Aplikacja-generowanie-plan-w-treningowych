import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../../firebase";

import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";
import { defaultWorkoutPlanTemplates } from "../constants/defaultWorkoutPlanTemplates";

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

export const saveWorkoutPlanTemplate = async (
  template: WorkoutPlanTemplate,
): Promise<void> => {
  await setDoc(
    doc(db, WORKOUT_PLAN_TEMPLATES_COLLECTION, template.id),
    template,
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
export const initializeWorkoutPlanTemplates = async (): Promise<void> => {
  const templates = await getWorkoutPlanTemplates();

  if (templates.length > 0) {
    return;
  }

  await Promise.all(
    defaultWorkoutPlanTemplates.map((template) =>
      saveWorkoutPlanTemplate(template),
    ),
  );
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
