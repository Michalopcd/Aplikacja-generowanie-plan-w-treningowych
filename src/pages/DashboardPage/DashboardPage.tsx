
import { MainLayout } from "../../pages/layouts/MainLayout/MainLayout";

const DashboardPage = () => {
 

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold md:text-3xl">
            Przegląd
          </h1>

          <p className="mt-1 text-sm text-muted">
            Zobacz swoje treningi i aktualny progres.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          Zawartość dashboardu pojawi się tutaj.
        </div>

        
      </section>
    </MainLayout>
  );
};

export default DashboardPage;