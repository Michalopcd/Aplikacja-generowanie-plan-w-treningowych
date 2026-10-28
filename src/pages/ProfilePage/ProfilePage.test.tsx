import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../features/auth/AuthContext";

import type { TrainingProfile } from "../../features/onboarding/types/onboarding";

import { regenerateWorkoutPlan } from "../../features/training/service/regenerateWorkoutPlanService";

import ProfilePage from "./ProfilePage";

vi.mock("../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../features/training/service/regenerateWorkoutPlanService", () => ({
  regenerateWorkoutPlan: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../features/profile/components/ProfilePageSkeleton", () => ({
  ProfilePageSkeleton: () => <div>Profile loading</div>,
}));

vi.mock("../../features/profile/components/ProfileAvatar", () => ({
  ProfileAvatar: () => <div>Profile avatar</div>,
}));

vi.mock("../../features/profile/components/EditTrainingProfileModal", () => ({
  EditTrainingProfileModal: ({
    onClose,
    onSave,
  }: {
    trainingProfile: TrainingProfile;
    onClose: () => void;
    onSave: (profile: TrainingProfile) => Promise<void>;
  }) => (
    <div>
      <p>Edit training profile modal</p>

      <button type="button" onClick={onClose}>
        Close modal
      </button>

      <button
        type="button"
        onClick={() =>
          onSave({
            age: 30,
            height: 185,
            weight: 90,
            gender: "male",
            trainingLocation: "gym",
            trainingDaysPerWeek: 4,
            experienceLevel: "intermediate",
            goal: "mass",
          })
        }
      >
        Save profile
      </button>
    </div>
  ),
}));

const mockedUseAuth = vi.mocked(useAuth);

const mockedUseQueryClient = vi.mocked(useQueryClient);

const mockedUseNavigate = vi.mocked(useNavigate);

const mockedRegenerateWorkoutPlan = vi.mocked(regenerateWorkoutPlan);

const mockedToastSuccess = vi.mocked(toast.success);

const mockedToastError = vi.mocked(toast.error);

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const navigate = vi.fn();

const queryClient = new QueryClient();

const trainingProfile: TrainingProfile = {
  age: 25,
  height: 180,
  weight: 85,
  gender: "male",
  trainingLocation: "gym",
  trainingDaysPerWeek: 3,
  experienceLevel: "beginner",
  goal: "mass",
};

const user: AuthUser = {
  uid: "user-1",
  firstName: "Michał",
  email: "michal@example.com",
  role: "user",
  onboardingCompleted: true,
  createdAt: new Date(2026, 9, 5),
  trainingProfile,
};

const renderProfilePage = () => {
  render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseNavigate.mockReturnValue(navigate);

  mockedUseQueryClient.mockReturnValue(queryClient);

  mockedUseAuth.mockReturnValue({
    user,
    isLoading: false,
    login,
    register,
    logout,
  });
});

describe("ProfilePage", () => {
  it("renders loading state", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login,
      register,
      logout,
    });

    renderProfilePage();

    expect(screen.getByText("Profile loading")).toBeInTheDocument();
  });

  it("renders error when user is not available", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login,
      register,
      logout,
    });

    renderProfilePage();

    expect(
      screen.getByText("Nie udało się pobrać danych użytkownika."),
    ).toBeInTheDocument();
  });

  it("renders empty state when training profile is missing", () => {
    mockedUseAuth.mockReturnValue({
      user: {
        ...user,
        trainingProfile: undefined,
      },
      isLoading: false,
      login,
      register,
      logout,
    });

    renderProfilePage();

    expect(screen.getByText("Brak profilu treningowego")).toBeInTheDocument();
  });

  it("renders user and training profile data", () => {
    renderProfilePage();

    expect(
      screen.getByRole("heading", {
        name: "Twoje dane i preferencje treningowe",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Michał")).toBeInTheDocument();

    expect(screen.getByText("michal@example.com")).toBeInTheDocument();

    expect(screen.getByText("25 lat")).toBeInTheDocument();

    expect(screen.getByText("180 cm")).toBeInTheDocument();

    expect(screen.getByText("85 kg")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Wróć do dashboardu",
      }),
    ).toBeInTheDocument();
  });

  it("opens and closes edit training profile modal", async () => {
    const userEventInstance = userEvent.setup();

    renderProfilePage();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Edytuj dane treningowe",
      }),
    );

    expect(screen.getByText("Edit training profile modal")).toBeInTheDocument();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Close modal",
      }),
    );

    expect(
      screen.queryByText("Edit training profile modal"),
    ).not.toBeInTheDocument();
  });

  it("regenerates workout plan after saving training profile", async () => {
    const userEventInstance = userEvent.setup();

    const setQueryDataSpy = vi.spyOn(queryClient, "setQueryData");

    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    const newPlan = await Promise.resolve(
      {} as Awaited<ReturnType<typeof regenerateWorkoutPlan>>,
    );

    mockedRegenerateWorkoutPlan.mockResolvedValue(newPlan);

    renderProfilePage();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Edytuj dane treningowe",
      }),
    );

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Save profile",
      }),
    );

    await waitFor(() => {
      expect(mockedRegenerateWorkoutPlan).toHaveBeenCalledWith("user-1", {
        age: 30,
        height: 185,
        weight: 90,
        gender: "male",
        trainingLocation: "gym",
        trainingDaysPerWeek: 4,
        experienceLevel: "intermediate",
        goal: "mass",
      });
    });

    expect(setQueryDataSpy).toHaveBeenCalled();

    expect(removeQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["completedWorkouts", "user-1"],
    });

    expect(mockedToastSuccess).toHaveBeenCalledWith(
      "Zmiany zostały zapisane i wygenerowano nowy plan treningowy.",
    );

    expect(navigate).toHaveBeenCalledWith("/plan");
  });

  it("shows error when workout plan regeneration fails", async () => {
    const userEventInstance = userEvent.setup();

    mockedRegenerateWorkoutPlan.mockRejectedValue(
      new Error("Regeneration failed"),
    );

    renderProfilePage();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Edytuj dane treningowe",
      }),
    );

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Save profile",
      }),
    );

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith(
        "Nie udało się zapisać zmian i wygenerować nowego planu.",
      );
    });

    expect(navigate).not.toHaveBeenCalled();
  });
});
