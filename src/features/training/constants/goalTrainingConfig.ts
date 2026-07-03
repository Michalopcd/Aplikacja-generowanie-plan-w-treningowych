import type {
  ExperienceLevel,
  TrainingGoal,
} from "../../onboarding/types/onboarding";
import type { RepsRange } from "../trainingPlan";

export type TrainingParameters = {
  sets: number;
  repsRange: RepsRange;
};

export const goalTrainingConfig: Record<
  TrainingGoal,
  Record<ExperienceLevel, TrainingParameters>
> = {
  reduction: {
    beginner: {
      sets: 3,
      repsRange: { min: 10, max: 15 },
    },
    intermediate: {
      sets: 4,
      repsRange: { min: 10, max: 15 },
    },
    advanced: {
      sets: 4,
      repsRange: { min: 12, max: 15 },
    },
  },

  recomposition: {
    beginner: {
      sets: 3,
      repsRange: { min: 8, max: 12 },
    },
    intermediate: {
      sets: 4,
      repsRange: { min: 8, max: 12 },
    },
    advanced: {
      sets: 4,
      repsRange: { min: 6, max: 12 },
    },
  },

  mass: {
    beginner: {
      sets: 3,
      repsRange: { min: 8, max: 12 },
    },
    intermediate: {
      sets: 4,
      repsRange: { min: 6, max: 10 },
    },
    advanced: {
      sets: 4,
      repsRange: { min: 6, max: 10 },
    },
  },
};