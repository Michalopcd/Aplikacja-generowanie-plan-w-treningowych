import type {
  ExperienceLevel,
  TrainingLocation,
} from "../../onboarding/types/onboarding";

import type { Exercise } from "../trainingPlan";

export const getAvailableExercises = (
  exercises: Exercise[],
  trainingLocation: TrainingLocation,
  experienceLevel: ExperienceLevel,
): Exercise[] => {
  return exercises.filter(
    (exercise) =>
      exercise.trainingLocations.includes(
        trainingLocation,
      ) &&
      exercise.experienceLevels.includes(
        experienceLevel,
      ),
  );
};