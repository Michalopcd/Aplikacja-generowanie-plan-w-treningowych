import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { WorkoutPlanTemplate } from "../../training/workoutPlanTemplate";

import {
  getWorkoutPlanTemplates,
  initializeWorkoutPlanTemplates,
} from "../../training/service/workoutPlanTemplateService";

export const useWorkoutPlanTemplates = () => {
  const [templates, setTemplates] = useState<
    WorkoutPlanTemplate[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const loadTemplates = useCallback(
    async () => {
      setIsLoading(true);
      setError("");

      try {
        await initializeWorkoutPlanTemplates();

        const workoutPlanTemplates =
          await getWorkoutPlanTemplates();

        const sortedTemplates = [
          ...workoutPlanTemplates,
        ].sort(
          (firstTemplate, secondTemplate) =>
            firstTemplate.trainingDaysPerWeek -
            secondTemplate.trainingDaysPerWeek,
        );

        setTemplates(sortedTemplates);
      } catch {
        setError(
          "Nie udało się pobrać szablonów planów.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
  };
};