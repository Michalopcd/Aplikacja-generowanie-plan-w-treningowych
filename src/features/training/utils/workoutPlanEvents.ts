import type { EventInput } from "@fullcalendar/core";

import type { WorkoutPlan } from "../trainingPlan";
import { createWorkoutSchedule } from "./workoutSchedule";

export const createWorkoutPlanEvents = (
  plan: WorkoutPlan,
): EventInput[] => {
  const workoutSchedule = createWorkoutSchedule(plan);

  return workoutSchedule.flatMap((scheduleWeek) =>
    scheduleWeek.workouts.map((scheduledWorkout) => ({
      id: `workout-${scheduledWorkout.scheduledDate}-${scheduledWorkout.workoutDay.dayNumber}`,

      title: scheduledWorkout.workoutDay.name,

      start: scheduledWorkout.scheduledDate,

      allDay: true,

      extendedProps: {
        workoutDay: scheduledWorkout.workoutDay,
        weekNumber: scheduleWeek.weekNumber,
        trainingNumber: scheduledWorkout.trainingNumber,
        scheduledDate: scheduledWorkout.scheduledDate,
      },
    })),
  );
};