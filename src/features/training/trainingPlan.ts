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
export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export type WorkoutDay = {
  dayNumber: number;
  weekDay: WeekDay;
  name: string;
  focusMuscleGroups: MuscleGroup[];
  exercises: WorkoutExercise[];
};

export type WorkoutPlanStatus = "active" | "archived";

export type WorkoutPlan = {
  id: string;
  uid: string;
  name: string;
  startDate: string;
  durationWeeks:number;
  goal: TrainingGoal;
  trainingLocation: TrainingLocation;
  experienceLevel: ExperienceLevel;
  workoutDays: WorkoutDay[];
  status: WorkoutPlanStatus;
  createdAt: Date;
  updatedAt: Date;
};