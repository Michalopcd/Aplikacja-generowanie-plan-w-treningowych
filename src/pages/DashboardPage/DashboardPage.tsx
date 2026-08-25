import { useAuth } from "../../features/auth/AuthContext";
import { DashboardRecentActivityCard } from "../../features/dashboard/components/DashboardRecentActivittyCard";
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
        <h1 className="text-2xl font-bold md:text-3xl">
          Przegląd
        </h1>

        <p className="mt-1 text-sm text-muted">
          Zobacz swoje treningi i aktualny progres.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <DashboardRecentActivityCard uid={user.uid} />
        </div>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;