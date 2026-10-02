import { useAuth } from "../../features/auth/AuthContext";

import DashboardPlanProgress from "../../features/dashboard/components/DashboardPlanProgress";
import { DashboardRecentActivityCard } from "../../features/dashboard/components/DashboardRecentActivittyCard";
import { DashboardStatsSection } from "../../features/dashboard/components/DashboardStatsSection";
import { DashboardWorkoutReminderCard } from "../../features/dashboard/components/DashboardWorkoutReminderCard";
import { LoadingState } from "../../ui/LoadingState";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingState message="Ładowanie dashboardu..." />
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="w-full">
      <div>
        <p className="text-sm font-semibold text-primary">
          Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold md:text-3xl">
          Przegląd treningów
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
          Sprawdź swoje najważniejsze statystyki, regularność i postęp
          w aktualnym planie treningowym.
        </p>
      </div>

      <div className="mt-6">
        <DashboardStatsSection uid={user.uid} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DashboardWorkoutReminderCard uid={user.uid} />
        <DashboardRecentActivityCard uid={user.uid} />
      </div>

      <div className="mt-6">
        <DashboardPlanProgress />
      </div>
    </section>
  );
};

export default DashboardPage;