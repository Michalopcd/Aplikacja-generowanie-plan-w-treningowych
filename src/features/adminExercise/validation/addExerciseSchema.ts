import * as Yup from "yup";

import type { MuscleGroup } from "../../training/trainingPlan";
import type {
  TrainingLocation,
} from "../../onboarding/types/onboarding";

export const addExerciseSchema = Yup.object({
  name: Yup.string().trim().required("Podaj nazwę ćwiczenia."),

  trainingLocation: Yup.mixed<TrainingLocation>()
    .oneOf(["home", "gym"])
    .required("Wybierz lokalizację."),

  muscleGroup: Yup.mixed<MuscleGroup>().required("Wybierz grupę mięśniową."),

  experienceLevels: Yup.array()
    .min(1, "Wybierz przynajmniej jeden poziom zaawansowania.")
    .required("Wybierz poziom zaawansowania."),
});
