import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { toast } from "react-toastify";

import { useAdminExercises } from "../../features/adminExercise/hooks/useAdminExercise";
import { useWorkoutPlanTemplates } from "../../features/adminExercise/hooks/useWorkoutPlanTemplates";

import {
  activateExercise,
  type FirestoreExercise,
} from "../../features/training/service/exerciseService";
import type { WorkoutPlanTemplate } from "../../features/training/workoutPlanTemplate";

import AdminPage from "./AdminPage";

vi.mock("../../features/adminExercise/hooks/useAdminExercise", () => ({
  useAdminExercises: vi.fn(),
}));

vi.mock("../../features/adminExercise/hooks/useWorkoutPlanTemplates", () => ({
  useWorkoutPlanTemplates: vi.fn(),
}));

vi.mock("../../features/training/service/exerciseService", () => ({
  activateExercise: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../layouts/AdminLayout/AdminLayout", () => ({
  AdminLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock(
  "../../features/adminExercise/components/AdminExercisesSection",
  () => ({
    AdminExercisesSection: ({
      exercises,
      onAdd,
      onActivate,
    }: {
      exercises: FirestoreExercise[];
      onAdd: () => void;
      onActivate: (exercise: FirestoreExercise) => void;
    }) => (
      <div>
        <p>Exercises section</p>

        <button type="button" onClick={onAdd}>
          Add exercise
        </button>

        {exercises[0] && (
          <button type="button" onClick={() => onActivate(exercises[0])}>
            Activate exercise
          </button>
        )}
      </div>
    ),
  }),
);

vi.mock(
  "../../features/adminExercise/components/AdminWorkoutTemplatesSection",
  () => ({
    AdminWorkoutTemplatesSection: () => <p>Templates section</p>,
  }),
);

vi.mock("../../features/adminExercise/components/AddExerciseModal", () => ({
  AddExerciseModal: () => <p>Add exercise modal</p>,
}));

vi.mock("../../features/adminExercise/components/EditExerciseModal", () => ({
  EditExerciseModal: () => <p>Edit exercise modal</p>,
}));

vi.mock("../../features/adminExercise/components/DeleteExerciseModal", () => ({
  DeleteExerciseModal: () => <p>Delete exercise modal</p>,
}));

vi.mock(
  "../../features/adminExercise/components/EditWorkoutPlanTemplateModal",
  () => ({
    EditWorkoutPlanTemplateModal: () => <p>Edit workout template modal</p>,
  }),
);

const mockedUseAdminExercises = vi.mocked(useAdminExercises);

const mockedUseWorkoutPlanTemplates = vi.mocked(useWorkoutPlanTemplates);

const mockedActivateExercise = vi.mocked(activateExercise);

const mockedToastSuccess = vi.mocked(toast.success);

const mockedToastError = vi.mocked(toast.error);

const exercise: FirestoreExercise = {
  id: "exercise-1",
  name: "Bench Press",
  trainingLocations: ["gym"],
  muscleGroups: ["chest"],
  experienceLevels: ["beginner"],
  isActive: false,
};

const templates: WorkoutPlanTemplate[] = [];

const loadExercises = vi.fn(async (): Promise<void> => {});

const loadTemplates = vi.fn(async (): Promise<void> => {});

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseAdminExercises.mockReturnValue({
    exercises: [exercise],
    isLoading: false,
    error: "",
    loadExercises,
  });

  mockedUseWorkoutPlanTemplates.mockReturnValue({
    templates,
    isLoading: false,
    error: "",
    loadTemplates,
  });

  mockedActivateExercise.mockResolvedValue(undefined);
});

describe("AdminPage", () => {
  it("renders the admin page and exercises section by default", () => {
    render(<AdminPage />);

    expect(
      screen.getByRole("heading", {
        name: "Panel administratora",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Exercises section")).toBeInTheDocument();

    expect(screen.queryByText("Templates section")).not.toBeInTheDocument();
  });

  it("switches to workout templates section", async () => {
    const user = userEvent.setup();

    render(<AdminPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Szablony planów",
      }),
    );

    expect(screen.getByText("Templates section")).toBeInTheDocument();

    expect(screen.queryByText("Exercises section")).not.toBeInTheDocument();
  });

  it("opens the add exercise modal", async () => {
    const user = userEvent.setup();

    render(<AdminPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Add exercise",
      }),
    );

    expect(screen.getByText("Add exercise modal")).toBeInTheDocument();
  });

  it("activates an exercise and reloads exercises", async () => {
    const user = userEvent.setup();

    render(<AdminPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Activate exercise",
      }),
    );

    await waitFor(() => {
      expect(mockedActivateExercise).toHaveBeenCalledWith("exercise-1");
    });

    expect(loadExercises).toHaveBeenCalledOnce();

    expect(mockedToastSuccess).toHaveBeenCalledWith(
      "Ćwiczenie zostało aktywowane.",
      {
        toastId: "exercise-activated",
      },
    );
  });

  it("shows an error message when exercise activation fails", async () => {
    const user = userEvent.setup();

    mockedActivateExercise.mockRejectedValue(new Error("Activation failed"));

    render(<AdminPage />);

    await user.click(
      screen.getByRole("button", {
        name: "Activate exercise",
      }),
    );

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith(
        "Nie udało się aktywować ćwiczenia.",
      );
    });

    expect(loadExercises).not.toHaveBeenCalled();
  });
});
