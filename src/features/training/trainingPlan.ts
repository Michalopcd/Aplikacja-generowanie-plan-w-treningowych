import type {
  ExperienceLevel,
  TrainingGoal,
  TrainingLocation,
} from "../onboarding/types/onboarding";

export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "core";

export type RepsRange = {
  min: number;
  max: number;
};

export type Exercise = {
  id: string;
  name: string;
  trainingLocations: TrainingLocation[];
  muscleGroups: MuscleGroup[];
  experienceLevels: ExperienceLevel[];
};

export type WorkoutExercise = {
  exercise: Exercise;
  sets: number;
  repsRange: RepsRange;
};

export type WorkoutDay = {
  dayNumber: number;
  name: string;
  focusMuscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];
};

export type WorkoutPlan = {
  id: string;
  name: string;
  goal: TrainingGoal;
  trainingLocation: TrainingLocation;
  experienceLevel: ExperienceLevel;
  workoutDays: WorkoutDay[];
};