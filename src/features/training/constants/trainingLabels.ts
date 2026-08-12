import type {
  ExperienceLevel,
  TrainingGoal,
  TrainingLocation,
} from "../../onboarding/types/onboarding";

import type {
  MuscleGroup,
  WeekDay,
} from "../trainingPlan";

export const goalLabels: Record<TrainingGoal, string> = {
  reduction: "Redukcja",
  recomposition: "Rekompozycja",
  mass: "Budowanie masy",
};

export const locationLabels: Record<TrainingLocation, string> = {
  home: "Dom",
  gym: "Siłownia",
};

export const experienceLevelLabels: Record<ExperienceLevel, string> = {
  beginner: "Początkujący",
  intermediate: "Średniozaawansowany",
  advanced: "Zaawansowany",
};

export const muscleGroupLabels: Record<MuscleGroup, string> = {
  chest: "Klatka",
  back: "Plecy",
  shoulders: "Barki",
  biceps: "Biceps",
  triceps: "Triceps",
  quadriceps: "Czworogłowe uda",
  hamstrings: "Dwugłowe uda",
  glutes: "Pośladki",
  calves: "Łydki",
  core: "Brzuch",
};

export const weekDayLabels: Record<WeekDay, string> = {
  monday: "Poniedziałek",
  tuesday: "Wtorek",
  wednesday: "Środa",
  thursday: "Czwartek",
  friday: "Piątek",
  saturday: "Sobota",
  sunday: "Niedziela",
};