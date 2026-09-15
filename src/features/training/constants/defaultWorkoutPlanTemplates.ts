import type { WorkoutPlanTemplate } from "../workoutPlanTemplate";

export const defaultWorkoutPlanTemplates: WorkoutPlanTemplate[] =
  [
    {
      id: "2-days",
      trainingDaysPerWeek: 2,
      isActive: true,
      workoutDays: [
        {
          dayNumber: 1,
          weekDay: "monday",
          name: "Trening całego ciała A",
          focusMuscleGroups: [
            "chest",
            "back",
            "quadriceps",
            "glutes",
            "core",
          ],
        },
        {
          dayNumber: 2,
          weekDay: "thursday",
          name: "Trening całego ciała B",
          focusMuscleGroups: [
            "shoulders",
            "biceps",
            "triceps",
            "hamstrings",
            "calves",
            "core",
          ],
        },
      ],
    },

    {
      id: "3-days",
      trainingDaysPerWeek: 3,
      isActive: true,
      workoutDays: [
        {
          dayNumber: 1,
          weekDay: "monday",
          name: "Push",
          focusMuscleGroups: [
            "chest",
            "shoulders",
            "triceps",
          ],
        },
        {
          dayNumber: 2,
          weekDay: "wednesday",
          name: "Pull",
          focusMuscleGroups: [
            "back",
            "biceps",
            "core",
          ],
        },
        {
          dayNumber: 3,
          weekDay: "friday",
          name: "Legs",
          focusMuscleGroups: [
            "quadriceps",
            "hamstrings",
            "glutes",
            "calves",
            "core",
          ],
        },
      ],
    },

    {
      id: "4-days",
      trainingDaysPerWeek: 4,
      isActive: true,
      workoutDays: [
        {
          dayNumber: 1,
          weekDay: "monday",
          name: "Góra ciała A",
          focusMuscleGroups: [
            "chest",
            "back",
            "shoulders",
          ],
        },
        {
          dayNumber: 2,
          weekDay: "tuesday",
          name: "Dół ciała A",
          focusMuscleGroups: [
            "quadriceps",
            "hamstrings",
            "glutes",
            "calves",
            "core",
          ],
        },
        {
          dayNumber: 3,
          weekDay: "thursday",
          name: "Góra ciała B",
          focusMuscleGroups: [
            "chest",
            "back",
            "biceps",
            "triceps",
          ],
        },
        {
          dayNumber: 4,
          weekDay: "friday",
          name: "Dół ciała B",
          focusMuscleGroups: [
            "quadriceps",
            "hamstrings",
            "glutes",
            "calves",
            "core",
          ],
        },
      ],
    },

    {
      id: "5-days",
      trainingDaysPerWeek: 5,
      isActive: true,
      workoutDays: [
        {
          dayNumber: 1,
          weekDay: "monday",
          name: "Push",
          focusMuscleGroups: [
            "chest",
            "shoulders",
            "triceps",
          ],
        },
        {
          dayNumber: 2,
          weekDay: "tuesday",
          name: "Pull",
          focusMuscleGroups: [
            "back",
            "biceps",
            "core",
          ],
        },
        {
          dayNumber: 3,
          weekDay: "wednesday",
          name: "Legs",
          focusMuscleGroups: [
            "quadriceps",
            "hamstrings",
            "glutes",
            "calves",
            "core",
          ],
        },
        {
          dayNumber: 4,
          weekDay: "thursday",
          name: "Góra ciała",
          focusMuscleGroups: [
            "chest",
            "back",
            "shoulders",
            "biceps",
            "triceps",
          ],
        },
        {
          dayNumber: 5,
          weekDay: "friday",
          name: "Dół ciała",
          focusMuscleGroups: [
            "quadriceps",
            "hamstrings",
            "glutes",
            "calves",
            "core",
          ],
        },
      ],
    },
  ];