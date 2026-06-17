export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingGoal = "reduction" | "recomposition" | "mass";

export type OnboardingFormValues = {
  age: string;
  height: string;
  weight: string;
  experienceLevel: ExperienceLevel | "";
  goal: TrainingGoal | "";
};