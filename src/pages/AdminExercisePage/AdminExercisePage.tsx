import { Plus } from "lucide-react";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import { useAdminExercises } from "../../features/adminExercise/useAdminExercise";
import { Button } from "../../ui/Button";

const AdminExercisePage = () => {
  const { exercises, error } = useAdminExercises();

  const muscleGroupsCount = new Set(
    exercises.flatMap((exercise) => exercise.muscleGroups),
  ).size;

  const trainingLocationsCount = new Set(
    exercises.flatMap((exercise) => exercise.trainingLocations),
  ).size;
  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Ćwiczenia</h1>

            <p className="mt-2 text-sm text-muted">
              Zarządzaj bazą ćwiczeń dostępnych w aplikacji.
            </p>
          </div>

          <Button type="button" className="flex items-center gap-2 px-5 py-3">
            <Plus size={18} />
            Dodaj ćwiczenie
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Ćwiczeń</p>

            <p className="mt-2 text-2xl font-bold">{exercises.length}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Grup mięśniowych</p>

            <p className="mt-2 text-2xl font-bold">{muscleGroupsCount}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-sm text-muted">Lokalizacji treningowych</p>

            <p className="mt-2 text-2xl font-bold">{trainingLocationsCount}</p>
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </section>
    </AdminLayout>
  );
};

export default AdminExercisePage;
