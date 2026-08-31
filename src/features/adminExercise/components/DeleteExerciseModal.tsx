import { useState } from "react";
import { toast } from "react-toastify";

import {
  deactivateExercise,
  type FirestoreExercise,
} from "../../training/service/exerciseService";

import { Button } from "../../../ui/Button";
import { FormError } from "../../../ui/FormError";

type Props = {
  exercise: FirestoreExercise;
  onClose: () => void;
  onExerciseDeleted: () => Promise<void>;
};

export const DeleteExerciseModal = ({
  exercise,
  onClose,
  onExerciseDeleted,
}: Props) => {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setError("");
      setIsDeleting(true);

      await deactivateExercise(exercise.id);

      await onExerciseDeleted();

      toast.success("Ćwiczenie zostało dezaktywowane.", {
        toastId: "exercise-deactivated",
      });

      onClose();
    } catch {
      setError("Nie udało się dezaktywować ćwiczenia.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6">
        <h2 className="text-xl font-bold">
          Dezaktywować ćwiczenie?
        </h2>

        <p className="mt-2 text-sm text-muted">
          Ćwiczenie{" "}
          <span className="font-semibold text-white">
            {exercise.name}
          </span>{" "}
          zostanie oznaczone jako nieaktywne.
        </p>

        <p className="mt-2 text-sm text-muted">
          Nie zostanie fizycznie usunięte z bazy.
        </p>

        {error && (
          <div className="mt-4">
            <FormError>{error}</FormError>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            className="bg-transparent"
            disabled={isDeleting}
          >
            Anuluj
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Dezaktywowanie..."
              : "Dezaktywuj"}
          </Button>
        </div>
      </div>
    </div>
  );
};