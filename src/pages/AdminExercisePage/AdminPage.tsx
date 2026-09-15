import { useState } from "react";

import { Plus } from "lucide-react";
import { toast } from "react-toastify";

import { AdminLayout } from "../layouts/AdminLayout/AdminLayout";

import { useAdminExercises } from "../../features/adminExercise/hooks/useAdminExercise";
import { useWorkoutPlanTemplates } from "../../features/adminExercise/hooks/useWorkoutPlanTemplates";

import { AdminExerciseTable } from "../../features/adminExercise/components/AdminExerciseTable";
import { AddExerciseModal } from "../../features/adminExercise/components/AddExerciseModal";
import { EditExerciseModal } from "../../features/adminExercise/components/EditExerciseModal";
import { DeleteExerciseModal } from "../../features/adminExercise/components/DeleteExerciseModal";

import { EditWorkoutPlanTemplateModal } from "../../features/adminExercise/components/EditWorkoutPlanTemplateModal";

import {
  type FirestoreExercise,
  activateExercise,
} from "../../features/training/service/exerciseService";

import type { WorkoutPlanTemplate } from "../../features/training/workoutPlanTemplate";

import { Button } from "../../ui/Button";

type AdminSection =
  | "exercises"
  | "templates";

const AdminPage = () => {
  const [activeSection, setActiveSection] =
    useState<AdminSection>("exercises");

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [
    selectedExercise,
    setSelectedExercise,
  ] = useState<FirestoreExercise | null>(null);

  const [
    exerciseToDelete,
    setExerciseToDelete,
  ] = useState<FirestoreExercise | null>(null);

  const [
    selectedTemplate,
    setSelectedTemplate,
  ] = useState<WorkoutPlanTemplate | null>(null);

  const {
    exercises,
    error,
    loadExercises,
  } = useAdminExercises();

  const {
    templates,
    isLoading: areTemplatesLoading,
    error: templatesError,
    loadTemplates,
  } = useWorkoutPlanTemplates();

  const handleActivateExercise = async (
    exercise: FirestoreExercise,
  ) => {
    try {
      await activateExercise(exercise.id);

      await loadExercises();

      toast.success(
        "Ćwiczenie zostało aktywowane.",
        {
          toastId: "exercise-activated",
        },
      );
    } catch {
      toast.error(
        "Nie udało się aktywować ćwiczenia.",
      );
    }
  };

  const muscleGroupsCount = new Set(
    exercises.flatMap(
      (exercise) => exercise.muscleGroups,
    ),
  ).size;

  const trainingLocationsCount = new Set(
    exercises.flatMap(
      (exercise) =>
        exercise.trainingLocations,
    ),
  ).size;

  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold">
            Panel administratora
          </h1>

          <p className="mt-2 text-sm text-zinc-300">
            Zarządzaj ćwiczeniami oraz szablonami
            planów treningowych.
          </p>
        </div>

        <div className="mt-6 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() =>
              setActiveSection("exercises")
            }
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
            onClick={() =>
              setActiveSection("templates")
            }
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
          <div className="mt-8">
            <div className="flex items-start justify-between gap-6 sm:items-center">
              <div>
                <h2 className="text-2xl font-bold">
                  Ćwiczenia
                </h2>

                <p className="mt-2 text-sm text-zinc-300">
                  Zarządzaj bazą ćwiczeń dostępnych
                  w aplikacji.
                </p>
              </div>

              <Button
                type="button"
                onClick={() =>
                  setIsAddModalOpen(true)
                }
                className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs sm:gap-2 sm:px-5 sm:py-3 sm:text-base"
              >
                <Plus size={18} />
                Dodaj ćwiczenie
              </Button>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted">
                  Ćwiczeń
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {exercises.length}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted">
                  Grup mięśniowych
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {muscleGroupsCount}
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-sm text-muted">
                  Lokalizacji treningowych
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {trainingLocationsCount}
                </p>
              </div>
            </div>

            {error && (
              <p className="mt-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <AdminExerciseTable
              exercises={exercises}
              onEdit={setSelectedExercise}
              onDelete={setExerciseToDelete}
              onActivate={
                handleActivateExercise
              }
            />
          </div>
        )}

        {activeSection === "templates" && (
          <div className="mt-8">
            <div>
              <h2 className="text-2xl font-bold">
                Szablony planów
              </h2>

              <p className="mt-2 text-sm text-zinc-300">
                Zarządzaj układem planów
                wykorzystywanych przez generator.
              </p>
            </div>

            {areTemplatesLoading && (
              <p className="mt-6 text-sm text-muted">
                Ładowanie szablonów...
              </p>
            )}

            {templatesError && (
              <p className="mt-6 text-sm text-red-400">
                {templatesError}
              </p>
            )}

            {!areTemplatesLoading &&
              !templatesError && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {templates.map(
                    (template) => (
                      <div
                        key={template.id}
                        className="rounded-2xl border border-border bg-card p-5"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-primary">
                              Szablon planu
                            </p>

                            <h3 className="mt-1 text-xl font-bold">
                              Plan{" "}
                              {
                                template.trainingDaysPerWeek
                              }
                              -dniowy
                            </h3>
                          </div>

                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {template.isActive
                              ? "Aktywny"
                              : "Nieaktywny"}
                          </span>
                        </div>

                        <div className="mt-5 space-y-3">
                          {template.workoutDays.map(
                            (workoutDay) => (
                              <div
                                key={
                                  workoutDay.dayNumber
                                }
                                className="rounded-xl border border-border bg-surface p-4"
                              >
                                <p className="text-sm font-semibold">
                                  {
                                    workoutDay.name
                                  }
                                </p>

                                <p className="mt-1 text-xs text-muted">
                                  {
                                    workoutDay
                                      .focusMuscleGroups
                                      .length
                                  }{" "}
                                  grup mięśniowych
                                </p>
                              </div>
                            ),
                          )}
                        </div>

                        <Button
                          type="button"
                          onClick={() =>
                            setSelectedTemplate(
                              template,
                            )
                          }
                          className="mt-5"
                        >
                          Edytuj szablon
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              )}
          </div>
        )}
      </section>

      {isAddModalOpen && (
        <AddExerciseModal
          onClose={() =>
            setIsAddModalOpen(false)
          }
          onExerciseAdded={loadExercises}
        />
      )}

      {selectedExercise && (
        <EditExerciseModal
          exercise={selectedExercise}
          onClose={() =>
            setSelectedExercise(null)
          }
          onExerciseUpdated={loadExercises}
        />
      )}

      {exerciseToDelete && (
        <DeleteExerciseModal
          exercise={exerciseToDelete}
          onClose={() =>
            setExerciseToDelete(null)
          }
          onExerciseDeleted={loadExercises}
        />
      )}

      {selectedTemplate && (
        <EditWorkoutPlanTemplateModal
          template={selectedTemplate}
          onClose={() =>
            setSelectedTemplate(null)
          }
          onTemplateUpdated={loadTemplates}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPage;