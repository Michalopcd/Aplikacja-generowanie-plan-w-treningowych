import { useEffect, useState } from "react";

import { getActiveWorkoutPlan } from "../../training/service/workoutPlanService";

import { getCurrentWorkoutWeekNumber } from "../../training/utils/getCurrentWorkoutWeek";

type PlanStage = {
  title: string;
  name: string;
  completedWeeks: number;
  totalWeeks: number;
  isLocked: boolean;
};

const WEEKS_PER_STAGE = 4;

const STAGES = [
  {
    title: "Miesiąc 1",
    name: "Adaptacja",
  },
  {
    title: "Miesiąc 2",
    name: "Progresja",
  },
  {
    title: "Miesiąc 3",
    name: "Intensyfikacja",
  },
];

export const useDashboardPlanProgress = (uid: string) => {
  const [completedWeeks, setCompletedWeeks] = useState(0);

  useEffect(() => {
    const loadPlanProgress = async () => {
      if (!uid) {
        setCompletedWeeks(0);

        return;
      }

      try {
        const activePlan = await getActiveWorkoutPlan(uid);

        if (!activePlan) {
          setCompletedWeeks(0);

          return;
        }

        const currentWeekNumber = getCurrentWorkoutWeekNumber(activePlan);

        setCompletedWeeks(Math.max(currentWeekNumber - 1, 0));
      } catch {
        setCompletedWeeks(0);
      }
    };

    loadPlanProgress();
  }, [uid]);

  const stages: PlanStage[] = STAGES.map((stage, index) => {
    const stageStartWeek = index * WEEKS_PER_STAGE;

    const completedWeeksInStage = Math.min(
      Math.max(completedWeeks - stageStartWeek, 0),
      WEEKS_PER_STAGE,
    );

    const isLocked = completedWeeks < stageStartWeek;

    return {
      ...stage,
      completedWeeks: completedWeeksInStage,
      totalWeeks: WEEKS_PER_STAGE,
      isLocked,
    };
  });

  return {
    stages,
  };
};
