import { useAuth } from "../../features/auth/AuthContext";
import { DashboardStatsSection } from "../../features/dashboard/components/DashboardStatsSection";
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
        </div>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;