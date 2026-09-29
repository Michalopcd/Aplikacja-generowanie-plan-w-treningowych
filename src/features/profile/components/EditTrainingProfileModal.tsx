import { useState } from "react";

import { X } from "lucide-react";

import type { TrainingProfile } from "../../onboarding/types/onboarding";

import {
  goalOptions,
  trainingDaysOptions,
  trainingLocationOptions,
} from "../../onboarding/constants/onboardingOptions";

import { Input } from "../../../ui/Input";
import { Button } from "../../../ui/Button";

type Props = {
  trainingProfile: TrainingProfile;
  onClose: () => void;
  onSave: (trainingProfile: TrainingProfile) => Promise<void>;
};

export const EditTrainingProfileModal = ({
  trainingProfile,
  onClose,
  onSave,
}: Props) => {
  const [goal, setGoal] = useState(trainingProfile.goal);
  const [trainingLocation, setTrainingLocation] = useState(
    trainingProfile.trainingLocation,
  );
  const [trainingDaysPerWeek, setTrainingDaysPerWeek] = useState(
    trainingProfile.trainingDaysPerWeek,
  );
  const [weight, setWeight] = useState(String(trainingProfile.weight));
  const [weightError, setWeightError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveChanges = () => {
    const parsedWeight = Number(weight);

    if (!Number.isFinite(parsedWeight) || parsedWeight <= 30) {
      setWeightError("Podaj prawidłową wagę większą od 30.");
      return;
    }

    setWeightError("");
    setIsConfirmOpen(true);
  };

  const handleConfirmChanges = async () => {
    const updatedTrainingProfile: TrainingProfile = {
      ...trainingProfile,
      goal,
      trainingLocation,
      trainingDaysPerWeek,
      weight: Number(weight),
    };

    try {
      setIsSaving(true);

      await onSave(updatedTrainingProfile);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6"
      >
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold text-white">
            Edytuj dane treningowe
          </p>

          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-zinc-400 transition hover:text-white"
            aria-label="Zamknij"
          >
            <X size={22} />
          </button>
        </div>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Zmień dane, na podstawie których zostanie wygenerowany nowy plan
          treningowy.
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSaveChanges();
          }}
        >
          <div className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="goal"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Cel treningowy
              </label>

              <select
                id="goal"
                value={goal}
                onChange={(event) =>
                  setGoal(event.target.value as TrainingProfile["goal"])
                }
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-white outline-none focus:border-primary"
              >
                {goalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="trainingLocation"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Miejsce treningu
              </label>

              <select
                id="trainingLocation"
                value={trainingLocation}
                onChange={(event) =>
                  setTrainingLocation(
                    event.target.value as TrainingProfile["trainingLocation"],
                  )
                }
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-white outline-none focus:border-primary"
              >
                {trainingLocationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="trainingDaysPerWeek"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Dni treningowe w tygodniu
              </label>

              <select
                id="trainingDaysPerWeek"
                value={trainingDaysPerWeek}
                onChange={(event) =>
                  setTrainingDaysPerWeek(Number(event.target.value))
                }
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-white outline-none focus:border-primary"
              >
                {trainingDaysOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="weight"
                className="mb-2 block text-sm font-medium text-zinc-200"
              >
                Waga
              </label>

              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(event) => {
                  setWeight(event.target.value);
                  setWeightError("");
                }}
                className="w-full"
              />

              {weightError && (
                <p className="mt-2 text-sm text-red-400">{weightError}</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" onClick={onClose}>
              Anuluj
            </Button>

            <Button type="submit">Zapisz zmiany</Button>
          </div>
        </form>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl border border-border bg-surface p-6"
          >
            <p className="text-xl font-semibold text-white">
              Potwierdź zmianę planu
            </p>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Zapisanie zmian spowoduje zakończenie obecnego planu treningowego
              i wygenerowanie nowego planu na podstawie nowych danych.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSaving}
              >
                Anuluj
              </Button>

              <Button
                type="button"
                onClick={handleConfirmChanges}
                disabled={isSaving}
              >
                {isSaving ? "Generowanie..." : "Potwierdź"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
