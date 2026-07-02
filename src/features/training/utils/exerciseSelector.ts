import type {
  ExperienceLevel,
  TrainingLocation,
} from "../../onboarding/types/onboarding";

import { exerciseDatabase } from "../constants/exerciseDatabase";
import type { Exercise } from "../trainingPlan";

export const getAvailableExercises = (
  trainingLocation: TrainingLocation,
  experienceLevel: ExperienceLevel,
): Exercise[] => {
  return exerciseDatabase.filter(
    (exercise) =>
      exercise.trainingLocations.includes(trainingLocation) &&
      exercise.experienceLevels.includes(experienceLevel),
  );
};