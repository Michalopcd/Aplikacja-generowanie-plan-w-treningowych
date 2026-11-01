import { useEffect, useState } from "react";

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

import { useActiveWorkoutPlanQuery } from "./useActiveWorkoutPlanQuery";
import { useCompletedWorkoutsQuery } from "./useCompletedWorkoutsQuery";

type GeneratePlanStatus = "idle" | "pending" | "success" | "error";

export const useTrainingPlan = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [savingWorkoutKey, setSavingWorkoutKey] = useState<string | null>(null);

  const [generatePlanStatus, setGeneratePlanStatus] =
    useState<GeneratePlanStatus>("idle");

  const today = formatDateToISO(new Date());

  const uid = user?.uid ?? "";

  const {
    data: plan,
    isLoading: isPlanLoading,
    error: planError,
    refetch: refetchPlan,
  } = useActiveWorkoutPlanQuery(uid);

  const {
    data: completedWorkouts = [],
    isLoading: isCompletedWorkoutsLoading,
    error: completedWorkoutsError,
    refetch: refetchCompletedWorkouts,
  } = useCompletedWorkoutsQuery(uid, plan?.id ?? "");

  useEffect(() => {
    if (
      !user?.uid ||
      !user.trainingProfile ||
      isPlanLoading ||
      planError ||
      plan ||
      generatePlanStatus !== "idle"
    ) {
      return;
    }

    const userId = user.uid;
    const trainingProfile = user.trainingProfile;

    const generatePlan = async () => {
      setGeneratePlanStatus("pending");

      try {
        const workoutPlanTemplate = await getWorkoutPlanTemplate(
          trainingProfile.trainingDaysPerWeek,
        );

        if (!workoutPlanTemplate) {
          throw new Error("Nie znaleziono szablonu planu treningowego.");
        }

        if (!workoutPlanTemplate.isActive) {
          throw new Error("Wybrany szablon planu jest nieaktywny.");
        }

        const exercises = await getActiveExercises();

        const newPlan = generateWorkoutPlan(
          userId,
          trainingProfile,
          workoutPlanTemplate,
          exercises,
        );

        await saveWorkoutPlan(newPlan);

        await refetchPlan();

        setGeneratePlanStatus("success");
      } catch {
        setGeneratePlanStatus("error");
      }
    };

    generatePlan();
  }, [
    user?.uid,
    user?.trainingProfile,
    isPlanLoading,
    planError,
    plan,
    generatePlanStatus,
    refetchPlan,
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

      await refetchCompletedWorkouts();

      toast.success("Trening został oznaczony jako wykonany.");
    } catch {
      toast.error("Nie udało się oznaczyć treningu jako wykonanego.");
    } finally {
      setSavingWorkoutKey(null);
    }
  };

  const isLoading =
    isAuthLoading ||
    (Boolean(uid) && isPlanLoading) ||
    generatePlanStatus === "pending" ||
    (Boolean(plan) && isCompletedWorkoutsLoading);

  const errorMessage =
    planError || completedWorkoutsError || generatePlanStatus === "error"
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
