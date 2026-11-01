export const SESSION_STORAGE_KEYS = {
  ACTIVE_WORKOUT_PLAN: "activeWorkoutPlan",
  COMPLETED_WORKOUTS: "completedWorkouts",
} as const;

export const getActiveWorkoutPlanStorageKey = (uid: string) =>
  `${SESSION_STORAGE_KEYS.ACTIVE_WORKOUT_PLAN}:${uid}`;

export const getCompletedWorkoutsStorageKey = (
  uid: string,
  workoutPlanId: string,
) => `${SESSION_STORAGE_KEYS.COMPLETED_WORKOUTS}:${uid}:${workoutPlanId}`;
