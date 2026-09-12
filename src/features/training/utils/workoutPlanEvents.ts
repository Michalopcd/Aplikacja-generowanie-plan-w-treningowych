import type { EventInput } from "@fullcalendar/core";

import type { WorkoutPlan } from "../trainingPlan";

import { createWorkoutKey } from "./workoutKey";
import { createWorkoutSchedule } from "./workoutSchedule";

export const createWorkoutPlanEvents = (
  plan: WorkoutPlan,
  completedWorkoutKeys: Set<string>,
): EventInput[] => {
  const workoutSchedule = createWorkoutSchedule(plan);

  return workoutSchedule.flatMap((scheduleWeek) =>
    scheduleWeek.workouts.map((scheduledWorkout) => {
      const workoutKey = createWorkoutKey(
        scheduledWorkout.scheduledDate,
        scheduledWorkout.workoutDay.dayNumber,
      );

      const isCompleted =
        completedWorkoutKeys.has(workoutKey);

      return {
        id: `workout-${scheduledWorkout.scheduledDate}-${scheduledWorkout.workoutDay.dayNumber}`,
        title: scheduledWorkout.workoutDay.name,
        start: scheduledWorkout.scheduledDate,
        allDay: true,

        startEditable: !isCompleted,

        extendedProps: {
          workoutDay: scheduledWorkout.workoutDay,
          weekNumber: scheduleWeek.weekNumber,
          weekStartDate: scheduleWeek.weekStartDate,
          weekEndDate: scheduleWeek.weekEndDate,
          trainingNumber:
            scheduledWorkout.trainingNumber,
          scheduledDate:
            scheduledWorkout.scheduledDate,
          isCompleted,
        },
      };
    }),
  );
};