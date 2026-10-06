import * as Yup from "yup";

import type {
  ExperienceLevel,
  TrainingLocation,
} from "../../onboarding/types/onboarding";
import type { MuscleGroup } from "../../training/trainingPlan";

export const addExerciseSchema = Yup.object({
  name: Yup.string().trim().required("Podaj nazwę ćwiczenia."),

  trainingLocation: Yup.mixed<TrainingLocation>()
    .oneOf(["home", "gym"])
    .required("Wybierz lokalizację."),

  muscleGroup: Yup.mixed<MuscleGroup>().required("Wybierz grupę mięśniową."),

  experienceLevels: Yup.array()
    .of(
      Yup.mixed<ExperienceLevel>()
        .oneOf(["beginner", "intermediate", "advanced"])
        .required(),
    )
    .min(1, "Wybierz przynajmniej jeden poziom zaawansowania.")
    .required("Wybierz poziom zaawansowania."),
});
