import { useState } from "react";

import { toast } from "react-toastify";

import { AddExerciseModal } from "../../features/adminExercise/components/AddExerciseModal";
import { AdminExercisesSection } from "../../features/adminExercise/components/AdminExercisesSection";
import { AdminWorkoutTemplatesSection } from "../../features/adminExercise/components/AdminWorkoutTemplatesSection";
import { DeleteExerciseModal } from "../../features/adminExercise/components/DeleteExerciseModal";
import { EditExerciseModal } from "../../features/adminExercise/components/EditExerciseModal";
import { EditWorkoutPlanTemplateModal } from "../../features/adminExercise/components/EditWorkoutPlanTemplateModal";

import { useAdminExercises } from "../../features/adminExercise/hooks/useAdminExercise";
import { useWorkoutPlanTemplates } from "../../features/adminExercise/hooks/useWorkoutPlanTemplates";

import {
  activateExercise,
  type FirestoreExercise,
} from "../../features/training/service/exerciseService";
import type { WorkoutPlanTemplate } from "../../features/training/workoutPlanTemplate";

import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";

type AdminSection = "exercises" | "templates";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>("exercises");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [selectedExercise, setSelectedExercise] =
    useState<FirestoreExercise | null>(null);

  const [exerciseToDelete, setExerciseToDelete] =
    useState<FirestoreExercise | null>(null);

  const [selectedTemplate, setSelectedTemplate] =
    useState<WorkoutPlanTemplate | null>(null);

  const {
    exercises,
    isLoading: areExercisesLoading,
    error: exercisesError,
    loadExercises,
  } = useAdminExercises();

  const {
    templates,
    isLoading: areTemplatesLoading,
    error: templatesError,
    loadTemplates,
  } = useWorkoutPlanTemplates();

  const handleActivateExercise = async (exercise: FirestoreExercise) => {
    try {
      await activateExercise(exercise.id);
      await loadExercises();

      toast.success("Ćwiczenie zostało aktywowane.", {
        toastId: "exercise-activated",
      });
    } catch {
      toast.error("Nie udało się aktywować ćwiczenia.");
    }
  };

  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold text-primary">Administracja</p>

          <h1 className="mt-1 text-2xl font-bold md:text-3xl">
            Panel administratora
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Zarządzaj ćwiczeniami oraz szablonami planów treningowych.
          </p>
        </div>

        <div className="mt-6 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setActiveSection("exercises")}
            className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeSection === "exercises"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            Ćwiczenia
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("templates")}
            className={`cursor-pointer border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeSection === "templates"
                ? "border-primary text-primary"
                : "border-transparent text-muted hover:text-white"
            }`}
          >
            Szablony planów
          </button>
        </div>

        {activeSection === "exercises" && (
          <AdminExercisesSection
            exercises={exercises}
            isLoading={areExercisesLoading}
            error={exercisesError}
            onAdd={() => setIsAddModalOpen(true)}
            onEdit={setSelectedExercise}
            onDelete={setExerciseToDelete}
            onActivate={handleActivateExercise}
          />
        )}

        {activeSection === "templates" && (
          <AdminWorkoutTemplatesSection
            templates={templates}
            isLoading={areTemplatesLoading}
            error={templatesError}
            onEdit={setSelectedTemplate}
          />
        )}
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

      {exerciseToDelete && (
        <DeleteExerciseModal
          exercise={exerciseToDelete}
          onClose={() => setExerciseToDelete(null)}
          onExerciseDeleted={loadExercises}
        />
      )}

      {selectedTemplate && (
        <EditWorkoutPlanTemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
          onTemplateUpdated={loadTemplates}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPage;
