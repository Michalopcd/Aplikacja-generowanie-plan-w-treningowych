export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingGoal = "reduction" | "recomposition" | "mass";

export type Gender = "female" | "male";

export type TrainingLocation = "home" | "gym";

export type TrainingDaysPerWeek = 2 | 3 | 4 | 5;

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
  trainingDaysPerWeek: TrainingDaysPerWeek;
  trainingLocation: TrainingLocation;
};
