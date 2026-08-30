import type {
  MuscleGroup,
} from "../../../training/trainingPlan"
import type {
  TrainingLocation,
  ExperienceLevel,
} from "../../../onboarding/types/onboarding"
export type AddExerciseFormValues = {
  name: string;
  trainingLocation: TrainingLocation;
  muscleGroup: MuscleGroup;
  experienceLevels: ExperienceLevel[];
};