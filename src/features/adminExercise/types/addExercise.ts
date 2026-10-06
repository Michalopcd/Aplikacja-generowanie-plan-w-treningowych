import type {
  ExperienceLevel,
  TrainingLocation,
} from "../../onboarding/types/onboarding";

import type { MuscleGroup } from "../../training/trainingPlan";

export type AddExerciseFormValues = {
  name: string;
  trainingLocation: TrainingLocation;
  muscleGroup: MuscleGroup;
  experienceLevels: ExperienceLevel[];
};