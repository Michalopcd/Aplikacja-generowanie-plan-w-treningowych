import type {
  ExperienceLevel,
  TrainingGoal,
} from "../../onboarding/types/onboarding";

import { goalTrainingConfig } from "../constants/goalTrainingConfig";
import type {
  Exercise,
  WorkoutExercise,
} from "../trainingPlan";

export const createWorkoutExercise = (
  exercise: Exercise,
  goal: TrainingGoal,
  experienceLevel: ExperienceLevel,
): WorkoutExercise => {
  const trainingParameters =
    goalTrainingConfig[goal][experienceLevel];

  return {
    exercise,
    sets: trainingParameters.sets,
    repsRange: trainingParameters.repsRange,
  };
};