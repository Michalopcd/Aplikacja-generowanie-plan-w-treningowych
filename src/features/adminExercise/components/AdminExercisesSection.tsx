import { Plus } from "lucide-react";

import type { FirestoreExercise } from "../../training/service/exerciseService";

import { AdminExerciseTable } from "./AdminExerciseTable";

import { Button } from "../../../ui/Button";
import { Card } from "../../../ui/Card";
import { EmptyState } from "../../../ui/EmptyState";
import { ErrorState } from "../../../ui/ErrorState";
import { LoadingState } from "../../../ui/LoadingState";

type AdminExercisesSectionProps = {
  exercises: FirestoreExercise[];
  isLoading: boolean;
  error: string;
  onAdd: () => void;
  onEdit: (exercise: FirestoreExercise) => void;
  onDelete: (exercise: FirestoreExercise) => void;
  onActivate: (exercise: FirestoreExercise) => void;
};

export const AdminExercisesSection = ({
  exercises,
  isLoading,
  error,
  onAdd,
  onEdit,
  onDelete,
  onActivate,
}: AdminExercisesSectionProps) => {
  const muscleGroupsCount = new Set(
    exercises.flatMap((exercise) => exercise.muscleGroups),
  ).size;

  const trainingLocationsCount = new Set(
    exercises.flatMap((exercise) => exercise.trainingLocations),
  ).size;

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-2xl font-bold">Ćwiczenia</p>

          <p className="mt-2 text-sm text-muted">
            Zarządzaj bazą ćwiczeń dostępnych w aplikacji.
          </p>
        </div>

        <Button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm sm:w-auto sm:px-5 sm:py-3 sm:text-base"
        >
          <Plus size={18} />
          Dodaj ćwiczenie
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="bg-card p-5">
          <p className="text-sm text-muted">Ćwiczeń</p>

          <p className="mt-2 text-2xl font-bold">{exercises.length}</p>
        </Card>

        <Card className="bg-card p-5">
          <p className="text-sm text-muted">Grup mięśniowych</p>

          <p className="mt-2 text-2xl font-bold">{muscleGroupsCount}</p>
        </Card>

        <Card className="bg-card p-5">
          <p className="text-sm text-muted">Lokalizacji treningowych</p>

          <p className="mt-2 text-2xl font-bold">{trainingLocationsCount}</p>
        </Card>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingState message="Ładowanie ćwiczeń..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : exercises.length === 0 ? (
          <EmptyState
            title="Brak ćwiczeń"
            description="Nie znaleziono żadnych ćwiczeń w bazie."
          />
        ) : (
          <AdminExerciseTable
            exercises={exercises}
            onEdit={onEdit}
            onDelete={onDelete}
            onActivate={onActivate}
          />
        )}
      </div>
    </div>
  );
};
