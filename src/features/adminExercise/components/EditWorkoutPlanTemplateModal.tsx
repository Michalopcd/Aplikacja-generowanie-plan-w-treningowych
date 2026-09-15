import { useState } from "react";

import { X } from "lucide-react";
import { toast } from "react-toastify";

import { updateWorkoutPlanTemplate } from "../../training/service/workoutPlanTemplateService";

import type { MuscleGroup, WeekDay } from "../../training/trainingPlan";
import {
  muscleGroupLabels,
  weekDayLabels,
} from "../../training/constants/trainingLabels";
import type { WorkoutPlanTemplate } from "../../training/workoutPlanTemplate";

import { Button } from "../../../ui/Button";

type Props = {
  template: WorkoutPlanTemplate;
  onClose: () => void;
  onTemplateUpdated: () => Promise<void>;
};

const weekDays: WeekDay[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
const muscleGroups: MuscleGroup[] = [
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

  const [error, setError] = useState("");

  const handleNameChange = (dayNumber: number, name: string) => {
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

  const handleSave = async () => {
    setError("");

    const hasEmptyName = editedTemplate.workoutDays.some(
      (workoutDay) => !workoutDay.name.trim(),
    );

    if (hasEmptyName) {
      setError("Każdy trening musi posiadać nazwę.");
      return;
    }

    const hasEmptyMuscleGroups = editedTemplate.workoutDays.some(
      (workoutDay) => workoutDay.focusMuscleGroups.length === 0,
    );

    if (hasEmptyMuscleGroups) {
      setError(
        "Każdy trening musi mieć przypisaną przynajmniej jedną grupę mięśniową.",
      );
      return;
    }

    const selectedWeekDays = editedTemplate.workoutDays.map(
      (workoutDay) => workoutDay.weekDay,
    );

    const uniqueWeekDays = new Set(selectedWeekDays);

    if (uniqueWeekDays.size !== selectedWeekDays.length) {
      setError(
        "Dwa treningi nie mogą być zaplanowane na ten sam dzień tygodnia.",
      );
      return;
    }

    try {
      setIsSaving(true);

      await updateWorkoutPlanTemplate(editedTemplate);

      await onTemplateUpdated();

      toast.success("Szablon planu został zaktualizowany.");

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
              Plan {editedTemplate.trainingDaysPerWeek}
              -dniowy
            </h2>
          </div>

          <Button
            type="button"
            variant="remove"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-surface p-2 text-black transition hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="mt-6 space-y-6">
          {editedTemplate.workoutDays.map((workoutDay) => (
            <div
              key={workoutDay.dayNumber}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <p className="text-sm font-semibold text-primary">
                Trening {workoutDay.dayNumber}
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nazwa treningu</label>

                  <input
                    type="text"
                    value={workoutDay.name}
                    onChange={(event) =>
                      handleNameChange(workoutDay.dayNumber, event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Dzień tygodnia</label>

                  <select
                    value={workoutDay.weekDay}
                    onChange={(event) =>
                      handleWeekDayChange(
                        workoutDay.dayNumber,
                        event.target.value as WeekDay,
                      )
                    }
                    className="mt-2 w-full cursor-pointer rounded-lg border border-border bg-surface px-4 py-3 text-sm text-white outline-none focus:border-primary"
                  >
                    {weekDays.map((weekDay) => (
                      <option key={weekDay} value={weekDay}>
                        {weekDayLabels[weekDay]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-sm font-medium">Partie mięśniowe</p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {muscleGroups.map((muscleGroup) => (
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
                        className="cursor-pointer"
                      />

                      <span className="cursor-pointer">
                        {muscleGroupLabels[muscleGroup]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" onClick={onClose} disabled={isSaving}>
            Anuluj
          </Button>

          <Button type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Zapisywanie..." : "Zapisz zmiany"}
          </Button>
        </div>
      </div>
    </div>
  );
};
