import { useEffect, useState } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { useAuth } from "../../auth/AuthContext";

import { saveCompletedWorkout } from "../service/completedWorkoutService";
import { getActiveExercises } from "../service/exerciseService";
import { saveWorkoutPlan } from "../service/workoutPlanService";
import { getWorkoutPlanTemplate } from "../service/workoutPlanTemplateService";

import type { ScheduledWorkout } from "../utils/workoutSchedule";

import { formatDateToISO } from "../utils/dateUtils";
import { generateWorkoutPlan } from "../utils/generateWorkoutPlan";
import { createWorkoutKey } from "../utils/workoutKey";

import {
  activeWorkoutPlanQueryKey,
  useActiveWorkoutPlanQuery
} from "./useActiveWorkoutPlanQuery";
import {
  completedWorkoutsQueryKey,
  useCompletedWorkoutsQuery
} from "./useCompletedWorkoutsQuery";

export const useTrainingPlan = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const queryClient = useQueryClient();

  const [savingWorkoutKey, setSavingWorkoutKey] = useState<string | null>(null);

  const today = formatDateToISO(new Date());

  const uid = user?.uid ?? "";

  const {
    data: plan,
    isPending: isPlanPending,
    isSuccess: isPlanSuccess,
    isError: isPlanError,
  } = useActiveWorkoutPlanQuery(uid);

  const {
    data: completedWorkouts = [],
    isPending: isCompletedWorkoutsPending,
    isError: isCompletedWorkoutsError,
  } = useCompletedWorkoutsQuery(uid, plan?.id ?? "");

  const generatePlanMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid || !user.trainingProfile) {
        throw new Error("Brak danych wymaganych do wygenerowania planu.");
      }

      const workoutPlanTemplate = await getWorkoutPlanTemplate(
        user.trainingProfile.trainingDaysPerWeek,
      );

      if (!workoutPlanTemplate) {
        throw new Error("Nie znaleziono szablonu planu treningowego.");
      }

      if (!workoutPlanTemplate.isActive) {
        throw new Error("Wybrany szablon planu jest nieaktywny.");
      }

      const exercises = await getActiveExercises();

      const newPlan = generateWorkoutPlan(
        user.uid,
        user.trainingProfile,
        workoutPlanTemplate,
        exercises,
      );

      await saveWorkoutPlan(newPlan);

      return newPlan;
    },

    onSuccess: (newPlan) => {
      if (!user?.uid) {
        return;
      }

      queryClient.setQueryData(activeWorkoutPlanQueryKey(user.uid), newPlan);
    },
  });

  useEffect(() => {
    if (
      !user?.uid ||
      !user.trainingProfile ||
      !isPlanSuccess ||
      plan ||
      generatePlanMutation.isPending ||
      generatePlanMutation.isSuccess ||
      generatePlanMutation.isError
    ) {
      return;
    }

    generatePlanMutation.mutate();
  }, [
    user?.uid,
    user?.trainingProfile,
    isPlanSuccess,
    plan,
    generatePlanMutation,
  ]);

  const completedWorkoutKeys = new Set(
    completedWorkouts.map((completedWorkout) =>
      createWorkoutKey(
        completedWorkout.scheduledDate,
        completedWorkout.workoutDayNumber,
      ),
    ),
  );

  const markWorkoutAsCompleted = async (scheduledWorkout: ScheduledWorkout) => {
    if (!user?.uid || !plan) {
      return;
    }

    if (scheduledWorkout.scheduledDate !== today) {
      toast.info("Możesz oznaczyć tylko dzisiejszy trening.");

      return;
    }

    const { workoutDay } = scheduledWorkout;

    const savingKey = createWorkoutKey(
      scheduledWorkout.scheduledDate,
      workoutDay.dayNumber,
    );

    setSavingWorkoutKey(savingKey);

    try {
      await saveCompletedWorkout({
        uid: user.uid,
        workoutPlanId: plan.id,
        workoutDayNumber: workoutDay.dayNumber,
        workoutDayName: workoutDay.name,
        weekNumber: scheduledWorkout.weekNumber,
        trainingNumber: scheduledWorkout.trainingNumber,
        scheduledDate: scheduledWorkout.scheduledDate,
        goal: plan.goal,
        exerciseCount: workoutDay.exercises.length,
      });

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: completedWorkoutsQueryKey(user.uid, plan.id),
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboardStats", user.uid],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboardWorkoutReminder", user.uid],
        }),

        queryClient.invalidateQueries({
          queryKey: ["dashboardRecentActivity", user.uid],
        }),
      ]);

      toast.success("Trening został oznaczony jako wykonany.");
    } catch {
      toast.error("Nie udało się oznaczyć treningu jako wykonanego.");
    } finally {
      setSavingWorkoutKey(null);
    }
  };

  const isLoading =
    isAuthLoading ||
    (Boolean(uid) && isPlanPending) ||
    generatePlanMutation.isPending ||
    (Boolean(plan) && isCompletedWorkoutsPending);

  const errorMessage =
    isPlanError || isCompletedWorkoutsError || generatePlanMutation.isError
      ? "Nie udało się pobrać albo zapisać planu treningowego."
      : "";

  return {
    plan: plan ?? null,
    today,
    isLoading,
    errorMessage,
    savingWorkoutKey,
    completedWorkoutKeys,
    markWorkoutAsCompleted,
  };
};
