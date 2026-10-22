import { useState } from "react";

import { X } from "lucide-react";
import { toast } from "react-toastify";

import { updateWorkoutPlanTemplate } from "../../training/service/workoutPlanTemplateService";

import type { MuscleGroup, WeekDay } from "../../training/trainingPlan";
import type { WorkoutPlanTemplate } from "../../training/workoutPlanTemplate";

import {
  muscleGroupLabels,
  weekDayLabels,
} from "../../training/constants/trainingLabels";

import { Button } from "../../../ui/Button";
import { FormError } from "../../../ui/FormError";

type Props = {
  template: WorkoutPlanTemplate;
  onClose: () => void;
  onTemplateUpdated: () => Promise<void>;
};

type WorkoutDayValidationErrors = {
  name?: string;
  weekDay?: string;
  muscleGroups?: string;
};

type TemplateValidationErrors = Partial<
  Record<number, WorkoutDayValidationErrors>
>;

const WEEK_DAYS: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

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

const validateTemplate = (
  template: WorkoutPlanTemplate,
): TemplateValidationErrors => {
  const validationErrors: TemplateValidationErrors = {};

  template.workoutDays.forEach((workoutDay) => {
    const workoutDayErrors: WorkoutDayValidationErrors = {};

    if (!workoutDay.name.trim()) {
      workoutDayErrors.name = "Nazwa treningu jest wymagana.";
    }

    if (workoutDay.focusMuscleGroups.length === 0) {
      workoutDayErrors.muscleGroups =
        "Wybierz przynajmniej jedną partię mięśniową.";
    }

    if (Object.keys(workoutDayErrors).length > 0) {
      validationErrors[workoutDay.dayNumber] = workoutDayErrors;
    }
  });

  const selectedWeekDays = template.workoutDays.map(
    (workoutDay) => workoutDay.weekDay,
  );

  template.workoutDays.forEach((workoutDay) => {
    const weekDayOccurrences = selectedWeekDays.filter(
      (weekDay) => weekDay === workoutDay.weekDay,
    ).length;

    if (weekDayOccurrences > 1) {
      validationErrors[workoutDay.dayNumber] = {
        ...validationErrors[workoutDay.dayNumber],
        weekDay: "Ten dzień tygodnia jest już przypisany do innego treningu.",
      };
    }
  });

  return validationErrors;
};

export const EditWorkoutPlanTemplateModal = ({
  template,
  onClose,
  onTemplateUpdated,
}: Props) => {
  const [editedTemplate, setEditedTemplate] = useState<WorkoutPlanTemplate>(
    () => ({
      ...template,
      workoutDays: template.workoutDays.map((workoutDay) => ({
        ...workoutDay,
        focusMuscleGroups: [...workoutDay.focusMuscleGroups],
      })),
    }),
  );

  const [isSaving, setIsSaving] = useState(false);

  const [validationErrors, setValidationErrors] =
    useState<TemplateValidationErrors>({});

  const [error, setError] = useState("");

  const clearValidationError = (
    dayNumber: number,
    field: keyof WorkoutDayValidationErrors,
  ) => {
    setValidationErrors((currentErrors) => {
      const workoutDayErrors = currentErrors[dayNumber];

      if (!workoutDayErrors?.[field]) {
        return currentErrors;
      }

      const updatedWorkoutDayErrors = {
        ...workoutDayErrors,
      };

      delete updatedWorkoutDayErrors[field];

      const updatedErrors = {
        ...currentErrors,
      };

      if (Object.keys(updatedWorkoutDayErrors).length === 0) {
        delete updatedErrors[dayNumber];
      } else {
        updatedErrors[dayNumber] = updatedWorkoutDayErrors;
      }

      return updatedErrors;
    });
  };

  const clearWeekDayValidationErrors = () => {
    setValidationErrors((currentErrors) => {
      const updatedErrors = {
        ...currentErrors,
      };

      Object.entries(updatedErrors).forEach(([dayNumber, workoutDayErrors]) => {
        if (!workoutDayErrors?.weekDay) {
          return;
        }

        const updatedWorkoutDayErrors = {
          ...workoutDayErrors,
        };

        delete updatedWorkoutDayErrors.weekDay;

        if (Object.keys(updatedWorkoutDayErrors).length === 0) {
          delete updatedErrors[Number(dayNumber)];
        } else {
          updatedErrors[Number(dayNumber)] = updatedWorkoutDayErrors;
        }
      });

      return updatedErrors;
    });
  };

  const handleNameChange = (dayNumber: number, name: string) => {
    clearValidationError(dayNumber, "name");

    setEditedTemplate((currentTemplate) => ({
      ...currentTemplate,
      workoutDays: currentTemplate.workoutDays.map((workoutDay) =>
        workoutDay.dayNumber === dayNumber
          ? {
              ...workoutDay,
              name,
            }
          : workoutDay,
      ),
    }));
  };

  const handleWeekDayChange = (dayNumber: number, weekDay: WeekDay) => {
    clearWeekDayValidationErrors();

    setEditedTemplate((currentTemplate) => ({
      ...currentTemplate,
      workoutDays: currentTemplate.workoutDays.map((workoutDay) =>
        workoutDay.dayNumber === dayNumber
          ? {
              ...workoutDay,
              weekDay,
            }
          : workoutDay,
      ),
    }));
  };

  const handleMuscleGroupToggle = (
    dayNumber: number,
    muscleGroup: MuscleGroup,
  ) => {
    clearValidationError(dayNumber, "muscleGroups");

    setEditedTemplate((currentTemplate) => ({
      ...currentTemplate,
      workoutDays: currentTemplate.workoutDays.map((workoutDay) => {
        if (workoutDay.dayNumber !== dayNumber) {
          return workoutDay;
        }

        const isSelected = workoutDay.focusMuscleGroups.includes(muscleGroup);

        return {
          ...workoutDay,
          focusMuscleGroups: isSelected
            ? workoutDay.focusMuscleGroups.filter(
                (group) => group !== muscleGroup,
              )
            : [...workoutDay.focusMuscleGroups, muscleGroup],
        };
      }),
    }));
  };

  const handleSaveTemplate = async () => {
    setError("");

    const currentValidationErrors = validateTemplate(editedTemplate);

    if (Object.keys(currentValidationErrors).length > 0) {
      setValidationErrors(currentValidationErrors);

      return;
    }

    setValidationErrors({});
    setIsSaving(true);

    try {
      await updateWorkoutPlanTemplate(editedTemplate);

      await onTemplateUpdated();

      toast.success("Szablon planu został zaktualizowany.", {
        toastId: "workout-template-updated",
      });

      onClose();
    } catch {
      setError("Nie udało się zaktualizować szablonu planu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-screen w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-surface p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">
              Edycja szablonu
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              {`Plan ${editedTemplate.trainingDaysPerWeek}-dniowy`}
            </h2>
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

        <div className="mt-6 space-y-6">
          {editedTemplate.workoutDays.map((workoutDay) => {
            const workoutDayErrors = validationErrors[workoutDay.dayNumber];

            return (
              <div
                key={workoutDay.dayNumber}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <p className="text-sm font-semibold text-primary">
                  Trening {workoutDay.dayNumber}
                </p>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Nazwa treningu
                    </label>

                    <input
                      type="text"
                      value={workoutDay.name}
                      onChange={(event) =>
                        handleNameChange(
                          workoutDay.dayNumber,
                          event.target.value,
                        )
                      }
                      className={`mt-2 w-full rounded-lg border bg-surface px-4 py-3 text-sm text-white outline-none transition ${
                        workoutDayErrors?.name
                          ? "border-red-400"
                          : "border-border focus:border-primary"
                      }`}
                    />

                    {workoutDayErrors?.name && (
                      <p className="mt-1 text-xs text-red-400">
                        {workoutDayErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Dzień tygodnia
                    </label>

                    <select
                      value={workoutDay.weekDay}
                      onChange={(event) =>
                        handleWeekDayChange(
                          workoutDay.dayNumber,
                          event.target.value as WeekDay,
                        )
                      }
                      className={`mt-2 w-full cursor-pointer rounded-lg border bg-surface px-4 py-3 text-sm text-white outline-none transition ${
                        workoutDayErrors?.weekDay
                          ? "border-red-400"
                          : "border-border focus:border-primary"
                      }`}
                    >
                      {WEEK_DAYS.map((weekDay) => (
                        <option key={weekDay} value={weekDay}>
                          {weekDayLabels[weekDay]}
                        </option>
                      ))}
                    </select>

                    {workoutDayErrors?.weekDay && (
                      <p className="mt-1 text-xs text-red-400">
                        {workoutDayErrors.weekDay}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium">Partie mięśniowe</p>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {MUSCLE_GROUPS.map((muscleGroup) => (
                      <label
                        key={muscleGroup}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface p-3 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={workoutDay.focusMuscleGroups.includes(
                            muscleGroup,
                          )}
                          onChange={() =>
                            handleMuscleGroupToggle(
                              workoutDay.dayNumber,
                              muscleGroup,
                            )
                          }
                          className="h-4 w-4 cursor-pointer accent-primary"
                        />

                        <span>{muscleGroupLabels[muscleGroup]}</span>
                      </label>
                    ))}
                  </div>

                  {workoutDayErrors?.muscleGroups && (
                    <p className="mt-2 text-xs text-red-400">
                      {workoutDayErrors.muscleGroups}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mt-4">
            <FormError>{error}</FormError>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="iconGhost"
            onClick={onClose}
            disabled={isSaving}
          >
            Anuluj
          </Button>

          <Button
            type="button"
            onClick={handleSaveTemplate}
            disabled={isSaving}
          >
            {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </div>
      </div>
    </div>
  );
};
