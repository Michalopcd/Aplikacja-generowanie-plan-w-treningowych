import { useState } from "react";
import { Formik } from "formik";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import {
  updateExercise,
  type FirestoreExercise,
  type CreateExerciseInput,
} from "../../training/service/exerciseService";

import { experienceLevelOptions } from "../constants/experienceLevelOptions";

import type { AddExerciseFormValues } from "../types/addExercise";
import { addExerciseSchema } from "../validation/addExerciseSchema";

import { Button } from "../../../ui/Button";
import { Input } from "../../../ui/Input";
import { FormError } from "../../../ui/FormError";

type Props = {
  exercise: FirestoreExercise;
  onClose: () => void;
  onExerciseUpdated: () => Promise<void>;
};

export const EditExerciseModal = ({
  exercise,
  onClose,
  onExerciseUpdated,
}: Props) => {
  const [submitError, setSubmitError] = useState("");

  const initialValues: AddExerciseFormValues = {
    name: exercise.name,
    trainingLocation:
      exercise.trainingLocations[0] ?? "gym",
    muscleGroup:
      exercise.muscleGroups[0] ?? "chest",
    experienceLevels: exercise.experienceLevels,
  };

  const handleEditExercise = async (
    values: AddExerciseFormValues,
  ) => {
    setSubmitError("");

    const updatedExercise: CreateExerciseInput = {
      name: values.name.trim(),
      trainingLocations: [values.trainingLocation],
      muscleGroups: [values.muscleGroup],
      experienceLevels: values.experienceLevels,
    };

    try {
      await updateExercise(
        exercise.id,
        updatedExercise,
      );

      await onExerciseUpdated();

      toast.success("Ćwiczenie zostało zaktualizowane.", {
        toastId: "exercise-updated",
      });

      onClose();
    } catch {
      setSubmitError(
        "Nie udało się zaktualizować ćwiczenia.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold">
              Edytuj ćwiczenie
            </p>

            <p className="mt-1 text-sm text-muted">
              Zmień dane wybranego ćwiczenia.
            </p>
          </div>

          <Button
            type="button"
            variant="remove"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-surface hover:text-white"
          >
            <X size={20} />
          </Button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={addExerciseSchema}
          onSubmit={handleEditExercise}
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
            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4"
            >
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
                  <FormError>
                    {errors.name}
                  </FormError>
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
                  <option value="gym">
                    Siłownia
                  </option>

                  <option value="home">
                    Dom
                  </option>
                </select>

                {touched.trainingLocation &&
                  errors.trainingLocation && (
                    <FormError>
                      {errors.trainingLocation}
                    </FormError>
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
                  <option value="chest">
                    Klatka piersiowa
                  </option>

                  <option value="back">
                    Plecy
                  </option>

                  <option value="shoulders">
                    Barki
                  </option>

                  <option value="biceps">
                    Biceps
                  </option>

                  <option value="triceps">
                    Triceps
                  </option>

                  <option value="quadriceps">
                    Czworogłowe uda
                  </option>

                  <option value="hamstrings">
                    Dwugłowe uda
                  </option>

                  <option value="glutes">
                    Pośladki
                  </option>

                  <option value="calves">
                    Łydki
                  </option>

                  <option value="core">
                    Brzuch
                  </option>
                </select>

                {touched.muscleGroup &&
                  errors.muscleGroup && (
                    <FormError>
                      {errors.muscleGroup}
                    </FormError>
                  )}
              </div>

              <div>
                <p className="mb-2 text-sm text-muted">
                  Poziom zaawansowania
                </p>

                <div className="space-y-2">
                  {experienceLevelOptions.map(
                    (level) => {
                      const isChecked =
                        values.experienceLevels.includes(
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
                              const updatedLevels =
                                isChecked
                                  ? values.experienceLevels.filter(
                                      (
                                        experienceLevel,
                                      ) =>
                                        experienceLevel !==
                                        level.value,
                                    )
                                  : [
                                      ...values.experienceLevels,
                                      level.value,
                                    ];

                              setFieldValue(
                                "experienceLevels",
                                updatedLevels,
                              );
                            }}
                          />

                          <span className="text-sm">
                            {level.label}
                          </span>
                        </label>
                      );
                    },
                  )}
                </div>

                {touched.experienceLevels &&
                  typeof errors.experienceLevels ===
                    "string" && (
                    <FormError>
                      {errors.experienceLevels}
                    </FormError>
                  )}
              </div>

              {submitError && (
                <FormError>
                  {submitError}
                </FormError>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  onClick={onClose}
                  className="bg-transparent"
                >
                  Anuluj
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Zapisywanie..."
                    : "Zapisz zmiany"}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};