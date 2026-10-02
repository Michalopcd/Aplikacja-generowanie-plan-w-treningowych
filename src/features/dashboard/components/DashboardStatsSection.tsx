import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import { ErrorState } from "../../../ui/ErrorState";
import { LoadingState } from "../../../ui/LoadingState";

import { useDashboardStats } from "../hooks/useDashboardStats";
import { DashboardStatsCard } from "./DashboardStatsCard";

type DashboardStatsSectionProps = {
  uid: string;
};

export const DashboardStatsSection = ({ uid }: DashboardStatsSectionProps) => {
  const { isLoading, errorMessage, stats } = useDashboardStats(uid);

  if (isLoading) {
    return (
      <Card className="bg-surface p-6">
        <LoadingState message="Ładowanie statystyk..." />
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-6">
        <ErrorState message={errorMessage} />
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-surface p-6">
        <EmptyState
          title="Brak aktywnego planu"
          description="Wygeneruj plan treningowy, aby zobaczyć statystyki na dashboardzie."
        />
      </Card>
    );
  }

  const completionChartData = [
    {
      label: "Ukończone",
      value: stats.completionPercentage,
    },
    {
      label: "Pozostałe",
      value: 100 - stats.completionPercentage,
    },
  ];

  const currentWeekProgress =
    stats.currentWeekPlannedWorkoutsCount > 0
      ? Math.round(
          (stats.currentWeekCompletedWorkoutsCount /
            stats.currentWeekPlannedWorkoutsCount) *
            100,
        )
      : 0;

  const currentWeekProgressData = [
    {
      label: "Postęp",
      value: currentWeekProgress,
    },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatsCard
        title="Wykonane treningi"
        value={String(stats.completedWorkoutsCount)}
        description={`z ${stats.plannedWorkoutsCount} zaplanowanych`}
        chartType="bar"
        chartData={stats.completedWorkoutsChartData}
      />

      <DashboardStatsCard
        title="Seria aktywności"
        value={`${stats.workoutStreakCount}`}
        description="treningi wykonane pod rząd"
        chartType="activity"
        chartData={stats.recentWorkoutActivity}
      />

      <DashboardStatsCard
        title="Postęp planu"
        value={`${stats.completionPercentage}%`}
        description="ukończenia aktualnego planu"
        chartType="donut"
        chartData={completionChartData}
      />

      <DashboardStatsCard
        title="Ten tydzień"
        value={`${stats.currentWeekCompletedWorkoutsCount} / ${stats.currentWeekPlannedWorkoutsCount}`}
        description={
          stats.currentWeekNumber
            ? `tydzień ${stats.currentWeekNumber}`
            : "poza zakresem planu"
        }
        chartType="progress"
        chartData={currentWeekProgressData}
      />
    </section>
  );
};
