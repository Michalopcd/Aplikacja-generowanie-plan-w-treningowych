import { useActiveWorkoutPlanQuery } from "../../training/hooks/useActiveWorkoutPlanQuery";

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
  const {
    data: activePlan,
    isPending,
    isError,
  } = useActiveWorkoutPlanQuery(uid);

  const currentWeekNumber = activePlan
    ? getCurrentWorkoutWeekNumber(activePlan)
    : 0;

  const completedWeeks = Math.max(currentWeekNumber - 1, 0);

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
    isLoading: Boolean(uid) && isPending,
    errorMessage: isError ? "Nie udało się pobrać postępu planu." : "",
  };
};
