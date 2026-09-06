import { Card } from "../../../ui/Card";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { DashboardStatsCard } from "./DashboardStatsCard";

type DashboardStatsSectionProps = {
  uid: string;
};

export const DashboardStatsSection = ({
  uid,
}: DashboardStatsSectionProps) => {
  const { isLoading, errorMessage, stats } = useDashboardStats(uid);

  if (isLoading) {
    return (
      <Card className="bg-surface p-5">
        <p className="text-sm text-muted">
          Ładowanie statystyk dashboardu...
        </p>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="bg-surface p-5">
        <p className="text-sm text-muted">{errorMessage}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="bg-surface p-5">
        <p className="text-sm font-medium text-muted">
          Statystyki treningowe
        </p>

        <h2 className="mt-2 text-xl font-bold">
          Brak aktywnego planu
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
          Wygeneruj plan treningowy, aby zobaczyć statystyki na
          dashboardzie.
        </p>
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

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardStatsCard
        title="Wykonane treningi"
        value={String(stats.completedWorkoutsCount)}
        description={`z ${stats.plannedWorkoutsCount} zaplanowanych`}
        chartType="line"
        chartData={stats.completedWorkoutsChartData}
      />

      <DashboardStatsCard
        title="Seria aktywności"
        value={`${stats.workoutStreakCount}`}
        description="treningi wykonane pod rząd"
        chartType="bar"
        chartData={stats.completedWorkoutsChartData}
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
        chartType="bar"
        chartData={stats.currentWeekChartData}
      />
    </section>
  );
};