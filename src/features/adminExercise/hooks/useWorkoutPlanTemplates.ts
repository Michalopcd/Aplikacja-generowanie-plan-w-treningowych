import { useCallback, useEffect, useState } from "react";

import { getWorkoutPlanTemplates } from "../../training/service/workoutPlanTemplateService";

import type { WorkoutPlanTemplate } from "../../training/workoutPlanTemplate";

const sortTemplates = (
  templates: WorkoutPlanTemplate[],
): WorkoutPlanTemplate[] => {
  return [...templates].sort(
    (firstTemplate, secondTemplate) =>
      firstTemplate.trainingDaysPerWeek - secondTemplate.trainingDaysPerWeek,
  );
};

export const useWorkoutPlanTemplates = () => {
  const [templates, setTemplates] = useState<WorkoutPlanTemplate[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const loadTemplates = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const workoutPlanTemplates = await getWorkoutPlanTemplates();

      setTemplates(sortTemplates(workoutPlanTemplates));
    } catch {
      setError("Nie udało się pobrać szablonów planów.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialTemplates = async () => {
      try {
        const workoutPlanTemplates = await getWorkoutPlanTemplates();

        setTemplates(sortTemplates(workoutPlanTemplates));
      } catch {
        setError("Nie udało się pobrać szablonów planów.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadInitialTemplates();
  }, []);

  return {
    templates,
    isLoading,
    error,
    loadTemplates,
  };
};
