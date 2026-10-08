import type { FirestoreExercise } from "../../training/service/exerciseService";

import {
  experienceLevelLabels,
  locationLabels,
  muscleGroupLabels,
} from "../../training/constants/trainingLabels";

import { Button } from "../../../ui/Button";

type Props = {
  exercises: FirestoreExercise[];
  onEdit: (exercise: FirestoreExercise) => void;
  onDelete: (exercise: FirestoreExercise) => void;
  onActivate: (exercise: FirestoreExercise) => void;
};

const getStatusClassName = (isActive: boolean): string => {
  return isActive
    ? "rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
    : "rounded-full bg-border px-3 py-1 text-xs font-medium text-muted";
};

const getMuscleGroupNames = (exercise: FirestoreExercise): string => {
  return exercise.muscleGroups
    .map((muscleGroup) => muscleGroupLabels[muscleGroup])
    .join(", ");
};

const getTrainingLocationNames = (exercise: FirestoreExercise): string => {
  return exercise.trainingLocations
    .map((trainingLocation) => locationLabels[trainingLocation])
    .join(", ");
};

const getExperienceLevelNames = (exercise: FirestoreExercise): string => {
  return exercise.experienceLevels
    .map((experienceLevel) => experienceLevelLabels[experienceLevel])
    .join(", ");
};

export const AdminExerciseTable = ({
  exercises,
  onEdit,
  onDelete,
  onActivate,
}: Props) => {
  return (
    <div className="mt-6">
      <div className="space-y-4 md:hidden">
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold">{exercise.name}</p>

                <p className="mt-1 text-sm text-muted">
                  {getMuscleGroupNames(exercise)}
                </p>
              </div>

              <span className={getStatusClassName(exercise.isActive)}>
                {exercise.isActive ? "Aktywne" : "Nieaktywne"}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="text-muted">Lokalizacja: </span>

                {getTrainingLocationNames(exercise)}
              </div>

              <div>
                <span className="text-muted">Poziom: </span>

                {getExperienceLevelNames(exercise)}
              </div>
            </div>

            <div className="mt-4 flex gap-4 border-t border-border pt-4">
              <Button
                type="button"
                variant="edit"
                onClick={() => onEdit(exercise)}
              >
                Edytuj
              </Button>

              {exercise.isActive ? (
                <Button
                  type="button"
                  variant="remove"
                  onClick={() => onDelete(exercise)}
                >
                  Dezaktywuj
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="success"
                  onClick={() => onActivate(exercise)}
                >
                  Aktywuj
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-5 py-4 font-medium">Ćwiczenie</th>

              <th className="px-5 py-4 font-medium">Grupy mięśniowe</th>

              <th className="px-5 py-4 font-medium">Lokalizacja</th>

              <th className="px-5 py-4 font-medium">Poziom</th>

              <th className="px-5 py-4 font-medium">Status</th>

              <th className="px-5 py-4 text-center font-medium">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {exercises.map((exercise) => (
              <tr
                key={exercise.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 font-medium">{exercise.name}</td>

                <td className="px-5 py-4 text-muted">
                  {getMuscleGroupNames(exercise)}
                </td>

                <td className="px-5 py-4 text-muted">
                  {getTrainingLocationNames(exercise)}
                </td>

                <td className="px-5 py-4 text-muted">
                  {getExperienceLevelNames(exercise)}
                </td>

                <td className="px-5 py-4">
                  <span className={getStatusClassName(exercise.isActive)}>
                    {exercise.isActive ? "Aktywne" : "Nieaktywne"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-3 whitespace-nowrap">
                    <Button
                      type="button"
                      variant="edit"
                      onClick={() => onEdit(exercise)}
                    >
                      Edytuj
                    </Button>

                    {exercise.isActive ? (
                      <Button
                        type="button"
                        variant="remove"
                        onClick={() => onDelete(exercise)}
                      >
                        Dezaktywuj
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="success"
                        onClick={() => onActivate(exercise)}
                      >
                        Aktywuj
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
