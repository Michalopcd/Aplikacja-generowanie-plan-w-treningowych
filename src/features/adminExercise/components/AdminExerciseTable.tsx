import type { FirestoreExercise } from "../../training/service/exerciseService";

type Props = {
  exercises: FirestoreExercise[];
};

export const AdminExerciseTable = ({
  exercises,
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
                <h3 className="font-semibold">
                  {exercise.name}
                </h3>

                <p className="mt-1 text-sm text-muted">
                  {exercise.muscleGroups.join(", ")}
                </p>
              </div>

              <span
                className={
                  exercise.isActive
                    ? "rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
                    : "rounded-full bg-border px-3 py-1 text-xs font-medium text-muted"
                }
              >
                {exercise.isActive ? "Aktywne" : "Nieaktywne"}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="text-muted">Lokalizacja: </span>
                {exercise.trainingLocations.join(", ")}
              </div>

              <div>
                <span className="text-muted">Poziom: </span>
                {exercise.experienceLevels.join(", ")}
              </div>
            </div>

            <div className="mt-4 flex gap-4 border-t border-border pt-4">
              <button
                type="button"
                className="text-sm font-medium text-primary"
              >
                Edytuj
              </button>

              <button
                type="button"
                className="text-sm font-medium text-red-400"
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>

    
      <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="px-5 py-4 font-medium">
                Ćwiczenie
              </th>

              <th className="px-5 py-4 font-medium">
                Grupy mięśniowe
              </th>

              <th className="px-5 py-4 font-medium">
                Lokalizacja
              </th>

              <th className="px-5 py-4 font-medium">
                Poziom
              </th>

              <th className="px-5 py-4 font-medium">
                Status
              </th>

              <th className="px-5 py-4 text-right font-medium">
                Akcje
              </th>
            </tr>
          </thead>

          <tbody>
            {exercises.map((exercise) => (
              <tr
                key={exercise.id}
                className="border-b border-border last:border-b-0"
              >
                <td className="px-5 py-4 font-medium">
                  {exercise.name}
                </td>

                <td className="px-5 py-4 text-muted">
                  {exercise.muscleGroups.join(", ")}
                </td>

                <td className="px-5 py-4 text-muted">
                  {exercise.trainingLocations.join(", ")}
                </td>

                <td className="px-5 py-4 text-muted">
                  {exercise.experienceLevels.join(", ")}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={
                      exercise.isActive
                        ? "rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success"
                        : "rounded-full bg-border px-3 py-1 text-xs font-medium text-muted"
                    }
                  >
                    {exercise.isActive ? "Aktywne" : "Nieaktywne"}
                  </span>
                </td>

                <td className="px-5 py-4 ">
                    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary"
                  >
                    Edytuj
                  </button>

                  <button
                    type="button"
                    className="ml-4 text-sm font-medium text-red-400"
                  >
                    Usuń
                  </button>
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