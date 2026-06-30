export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingGoal = "reduction" | "recomposition" | "mass";

export type Gender = "female" | "male" | "prefer_not_to_say";

export type TrainingLocation = "home" | "gym";

export type OnboardingFormValues = {
  firstName: string;
  age: string;
  height: string;
  weight: string;
  gender: Gender | "";
  experienceLevel: ExperienceLevel | "";
  goal: TrainingGoal | "";
  trainingDaysPerWeek: string;
  trainingLocation: TrainingLocation | "";
};
export type TrainingProfile = {
  age: number;
  height: number;
  weight: number;
  gender: Gender;
  experienceLevel: ExperienceLevel;
  goal: TrainingGoal;
  trainigDaysPerWeek:number;
  trainingLocation: TrainingLocation;
};
