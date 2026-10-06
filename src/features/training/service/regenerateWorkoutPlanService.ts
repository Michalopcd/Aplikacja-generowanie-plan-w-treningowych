import type { TrainingProfile } from "../../onboarding/types/onboarding";

import { getActiveExercises } from "./exerciseService";
import { getActiveWorkoutPlan, replaceWorkoutPlan } from "./workoutPlanService";
import { getWorkoutPlanTemplate } from "./workoutPlanTemplateService";

import { generateWorkoutPlan } from "../utils/generateWorkoutPlan";

export const regenerateWorkoutPlan = async (
  uid: string,
  trainingProfile: TrainingProfile,
): Promise<void> => {
  const activePlan = await getActiveWorkoutPlan(uid);

  const workoutPlanTemplate = await getWorkoutPlanTemplate(
    trainingProfile.trainingDaysPerWeek,
  );

  if (!workoutPlanTemplate) {
    throw new Error("Nie znaleziono szablonu planu treningowego.");
  }

  if (!workoutPlanTemplate.isActive) {
    throw new Error("Wybrany szablon planu jest nieaktywny.");
  }

  const exercises = await getActiveExercises();

  const newPlan = generateWorkoutPlan(
    uid,
    trainingProfile,
    workoutPlanTemplate,
    exercises,
  );

  await replaceWorkoutPlan({
    uid,
    trainingProfile,
    activePlanId: activePlan?.id,
    newPlan,
  });
};
