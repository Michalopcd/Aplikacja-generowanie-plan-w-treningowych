import { useAuth } from "../../features/auth/AuthContext";
import DashboardPlanProgress from "../../features/dashboard/components/DashboardPlanProgress";
import { DashboardRecentActivityCard } from "../../features/dashboard/components/DashboardRecentActivittyCard";
import { DashboardStatsSection } from "../../features/dashboard/components/DashboardStatsSection";
import { DashboardWorkoutReminderCard } from "../../features/dashboard/components/DashboardWorkoutReminderCard";
import { MainLayout } from "../layouts/MainLayout/MainLayout";

const DashboardPage = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Ładowanie...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout user={user}>
      <section className="w-full">
        <div>
          <p className="text-sm font-medium text-primary">
            Dashboard
          </p>

          <h1 className="mt-2 text-2xl font-bold md:text-3xl">
            Przegląd treningów
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Sprawdź swoje najważniejsze statystyki, regularność i
            postęp w aktualnym planie treningowym.
          </p>
        </div>

        <div className="mt-6">
          <DashboardStatsSection uid={user.uid} />
        <h1 className="text-2xl font-bold md:text-3xl">
          Przegląd
        </h1>

        <p className="mt-1 text-sm text-muted">
          Zobacz swoje treningi i aktualny progres.
        </p>

        <div className="mt-8">
          <DashboardPlanProgress />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DashboardRecentActivityCard uid={user.uid} />
        </div>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;