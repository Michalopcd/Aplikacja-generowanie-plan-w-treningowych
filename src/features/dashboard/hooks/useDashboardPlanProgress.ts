type PlanStage = {
  title: string;
  name: string;
  completedWeeks: number;
  totalWeeks: number;
  isLocked: boolean;
};

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

export const useDashboardPlanProgress = () => {
  const completedWeeks = 0;

  const stages: PlanStage[] = STAGES.map((stage, index) => {
    const stageStartWeek = index * 4;

    const completedWeeksInStage = Math.min(
      Math.max(completedWeeks - stageStartWeek, 0),
      4
    );

    const isLocked = completedWeeks < stageStartWeek;

    return {
      ...stage,
      completedWeeks: completedWeeksInStage,
      totalWeeks: 4,
      isLocked,
    };
  });

  return {
    stages,
  };
};