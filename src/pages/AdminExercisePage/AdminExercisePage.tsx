import { useState } from "react";
import { Plus } from "lucide-react";
import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";
import { useAdminExercises } from "../../features/adminExercise/hooks/useAdminExercise";
import { AdminExerciseTable } from "../../features/adminExercise/components/AdminExerciseTable";
import { AddExerciseModal } from "../../features/adminExercise/components/AddExerciseModal";
import { EditExerciseModal } from "../../features/adminExercise/components/EditExerciseModal";
import type { FirestoreExercise } from "../../features/training/service/exerciseService";
import { Button } from "../../ui/Button";

const AdminExercisePage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] =
    useState<FirestoreExercise | null>(null);

  const { exercises, error, loadExercises } = useAdminExercises();

  const muscleGroupsCount = new Set(
    exercises.flatMap((exercise) => exercise.muscleGroups),
  ).size;

  const trainingLocationsCount = new Set(
    exercises.flatMap((exercise) => exercise.trainingLocations),
  ).size;
  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-6 sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Ćwiczenia</h1>

            <p className="mt-2 text-sm text-muted">
              Zarządzaj bazą ćwiczeń dostępnych w aplikacji.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:gap-2 sm:px-5 sm:py-3 sm:text-base  "
          >
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

        <AdminExerciseTable
          exercises={exercises}
          onEdit={setSelectedExercise}
        />
      </section>
      {isAddModalOpen && (
        <AddExerciseModal
          onClose={() => setIsAddModalOpen(false)}
          onExerciseAdded={loadExercises}
        />
      )}
      {selectedExercise && (
        <EditExerciseModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onExerciseUpdated={loadExercises}
        />
      )}   
    </AdminLayout>
  );
};

export default AdminExercisePage;
