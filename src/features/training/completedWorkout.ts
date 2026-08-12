import type { TrainingGoal } from "../onboarding/types/onboarding";

export type CompletedWorkout={
 id: string;
  uid: string;
  workoutPlanId: string;
  workoutDayNumber: number;
  workoutDayName: string;
  weekNumber: number;
  trainingNumber: number;
  scheduledDate: string;
  completedDate: string;
  completedAt: Date;
  goal: TrainingGoal;
  exerciseCount: number;
}