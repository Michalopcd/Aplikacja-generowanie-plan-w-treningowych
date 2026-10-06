import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useAuth } from "../../auth/AuthContext";

import {
  getCompletedWorkoutsForPlan,
  saveCompletedWorkout,
} from "../service/completedWorkoutService";
import { getActiveExercises } from "../service/exerciseService";
import {
  getActiveWorkoutPlan,
  saveWorkoutPlan,
} from "../service/workoutPlanService";
import { getWorkoutPlanTemplate } from "../service/workoutPlanTemplateService";

import type { WorkoutPlan } from "../trainingPlan";
import type { ScheduledWorkout } from "../utils/workoutSchedule";

import { formatDateToISO } from "../utils/dateUtils";
import { generateWorkoutPlan } from "../utils/generateWorkoutPlan";
import { createWorkoutKey } from "../utils/workoutKey";

export const useTrainingPlan = () => {
  const { user, isLoading: isAuthLoading } = useAuth();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  const [isPlanLoading, setIsPlanLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [savingWorkoutKey, setSavingWorkoutKey] = useState<string | null>(null);

  const [completedWorkoutKeys, setCompletedWorkoutKeys] = useState<Set<string>>(
    new Set(),
  );

  const today = formatDateToISO(new Date());

  useEffect(() => {
    const loadWorkoutPlan = async () => {
      if (!user?.uid || !user.trainingProfile) {
        setPlan(null);
        setCompletedWorkoutKeys(new Set());
        setIsPlanLoading(false);

        return;
      }

      setIsPlanLoading(true);
      setErrorMessage("");

      try {
        const activePlan = await getActiveWorkoutPlan(user.uid);

        if (activePlan) {
          const completedWorkouts = await getCompletedWorkoutsForPlan(
            user.uid,
            activePlan.id,
          );

          const completedKeys = new Set(
            completedWorkouts.map((completedWorkout) =>
              createWorkoutKey(
                completedWorkout.scheduledDate,
                completedWorkout.workoutDayNumber,
              ),
            ),
          );

          setCompletedWorkoutKeys(completedKeys);
          setPlan(activePlan);

          return;
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

        setCompletedWorkoutKeys(new Set());
        setPlan(newPlan);
      } catch {
        setErrorMessage(
          "Nie udało się pobrać albo zapisać planu treningowego.",
        );
      } finally {
        setIsPlanLoading(false);
      }
    };

    loadWorkoutPlan();
  }, [user?.uid, user?.trainingProfile]);

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

      setCompletedWorkoutKeys((currentCompletedWorkoutKeys) => {
        const updatedCompletedWorkoutKeys = new Set(
          currentCompletedWorkoutKeys,
        );

        updatedCompletedWorkoutKeys.add(savingKey);

        return updatedCompletedWorkoutKeys;
      });

      toast.success("Trening został oznaczony jako wykonany.");
    } catch {
      toast.error("Nie udało się oznaczyć treningu jako wykonanego.");
    } finally {
      setSavingWorkoutKey(null);
    }
  };

  return {
    plan,
    today,
    isLoading: isAuthLoading || isPlanLoading,
    errorMessage,
    savingWorkoutKey,
    completedWorkoutKeys,
    markWorkoutAsCompleted,
  };
};
