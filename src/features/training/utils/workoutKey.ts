export const createWorkoutKey = (
  scheduledDate: string,
  workoutDayNumber: number,
): string => {
  return `${scheduledDate}_${workoutDayNumber}`;
};