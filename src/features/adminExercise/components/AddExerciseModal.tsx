import { useState } from "react";

import { Formik } from "formik";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { addExercise } from "../../training/service/exerciseService";

import type { CreateExerciseInput } from "../../training/service/exerciseService";
import type { MuscleGroup } from "../../training/trainingPlan";
import type { AddExerciseFormValues } from "../types/addExercise";

import {
  experienceLevelOptions,
  trainingLocationOptions,
} from "../../onboarding/constants/onboardingOptions";
import { muscleGroupLabels } from "../../training/constants/trainingLabels";
import { addExerciseInitialValues } from "../constants/addExerciseInitialValues";
import { addExerciseSchema } from "../validation/addExerciseSchema";

import { Button } from "../../../ui/Button";
import { FormError } from "../../../ui/FormError";
import { Input } from "../../../ui/Input";

type Props = {
  onClose: () => void;
  onExerciseAdded: () => Promise<void>;
};

const MUSCLE_GROUPS: MuscleGroup[] = [
  "chest",
  "back",
  "shoulders",
  "biceps",
  "triceps",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "core",
];

export const AddExerciseModal = ({ onClose, onExerciseAdded }: Props) => {
  const [submitError, setSubmitError] = useState("");

  const handleAddExercise = async (values: AddExerciseFormValues) => {
    setSubmitError("");

    const exercise: CreateExerciseInput = {
      name: values.name.trim(),
      trainingLocations: [values.trainingLocation],
      muscleGroups: [values.muscleGroup],
      experienceLevels: values.experienceLevels,
    };

    try {
      await addExercise(exercise);

      await onExerciseAdded();

      toast.success("Ćwiczenie zostało dodane.", {
        toastId: "exercise-added",
      });

      onClose();
    } catch {
      setSubmitError("Nie udało się dodać ćwiczenia.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">Dodaj ćwiczenie</p>

            <p className="mt-1 text-sm text-muted">
              Dodaj nowe ćwiczenie do bazy.
            </p>
          </div>

          <Button
            type="button"
            variant="iconGhost"
            onClick={onClose}
            className="p-2"
            aria-label="Zamknij"
          >
            <X size={20} />
          </Button>
        </div>

        <Formik
          initialValues={addExerciseInitialValues}
          validationSchema={addExerciseSchema}
          onSubmit={handleAddExercise}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Input
                  className="w-full"
                  type="text"
                  name="name"
                  placeholder="Nazwa ćwiczenia"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {touched.name && errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <select
                  name="trainingLocation"
                  value={values.trainingLocation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {trainingLocationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {touched.trainingLocation && errors.trainingLocation && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.trainingLocation}
                  </p>
                )}
              </div>

              <div>
                <select
                  name="muscleGroup"
                  value={values.muscleGroup}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  {MUSCLE_GROUPS.map((muscleGroup) => (
                    <option key={muscleGroup} value={muscleGroup}>
                      {muscleGroupLabels[muscleGroup]}
                    </option>
                  ))}
                </select>

                {touched.muscleGroup && errors.muscleGroup && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.muscleGroup}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm text-muted">Poziom zaawansowania</p>

                <div className="space-y-2">
                  {experienceLevelOptions.map((level) => {
                    const isChecked = values.experienceLevels.includes(
                      level.value,
                    );

                    return (
                      <label
                        key={level.value}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-3 py-2"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            const updatedLevels = isChecked
                              ? values.experienceLevels.filter(
                                  (experienceLevel) =>
                                    experienceLevel !== level.value,
                                )
                              : [...values.experienceLevels, level.value];

                            setFieldValue("experienceLevels", updatedLevels);
                          }}
                        />

                        <span className="text-sm">{level.label}</span>
                      </label>
                    );
                  })}
                </div>

                {touched.experienceLevels &&
                  typeof errors.experienceLevels === "string" && (
                    <p className="mt-2 text-xs text-red-400">
                      {errors.experienceLevels}
                    </p>
                  )}
              </div>

              {submitError && <FormError>{submitError}</FormError>}

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="iconGhost" onClick={onClose}>
                  Anuluj
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Dodawanie..." : "Dodaj ćwiczenie"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};
