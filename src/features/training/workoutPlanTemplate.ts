import type {
  MuscleGroup,
  WeekDay,
} from "./trainingPlan";

export type WorkoutPlanTemplateDay = {
  dayNumber: number;
  weekDay: WeekDay;
  name: string;
  focusMuscleGroups: MuscleGroup[];
};

export type WorkoutPlanTemplate = {
  id: string;
  trainingDaysPerWeek: 2 | 3 | 4 | 5;
  workoutDays: WorkoutPlanTemplateDay[];
  isActive: boolean;
};