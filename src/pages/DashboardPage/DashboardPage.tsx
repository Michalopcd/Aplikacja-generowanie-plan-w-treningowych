import { MainLayout } from "../layouts/MainLayout/MainLayout";
import { useAuth } from "../../features/auth/AuthContext";


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
      <section className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold md:text-3xl">
          Przegląd
        </h1>

        <p className="mt-1 text-sm text-muted">
          Zobacz swoje treningi i aktualny progres.
        </p>
      </section>
    </MainLayout>
  );
};

export default DashboardPage;