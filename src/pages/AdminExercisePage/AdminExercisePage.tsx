import { Plus } from "lucide-react";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import { Button } from "../../ui/Button";

const AdminExercisePage = () => {
  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">
              Ćwiczenia
            </h1>

            <p className="mt-2 text-sm text-muted">
              Zarządzaj bazą ćwiczeń dostępnych w aplikacji.
            </p>
          </div>

          <Button
            type="button"
            className="flex items-center gap-2 px-5 py-3"
          >
            <Plus size={18} />
            Dodaj ćwiczenie
          </Button>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminExercisePage;