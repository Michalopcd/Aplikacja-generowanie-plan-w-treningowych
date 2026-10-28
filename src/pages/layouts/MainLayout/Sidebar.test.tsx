import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../features/auth/AuthContext";
import { useActiveWorkoutPlanQuery } from "../../../features/training/hooks/useActiveWorkoutPlanQuery";

import { getCurrentWorkoutWeekNumber } from "../../../features/training/utils/getCurrentWorkoutWeek";

import { ROUTES } from "../../../utils/route";

import { Sidebar } from "./Sidebar";

let activePlan:
  | NonNullable<ReturnType<typeof useActiveWorkoutPlanQuery>["data"]>
  | undefined;

vi.mock("../../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../../features/training/hooks/useActiveWorkoutPlanQuery", () => ({
  useActiveWorkoutPlanQuery: vi.fn(() => ({
    data: activePlan,
  })),
}));

vi.mock("../../../features/training/utils/getCurrentWorkoutWeek", () => ({
  getCurrentWorkoutWeekNumber: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockedUseAuth = vi.mocked(useAuth);

const mockedUseNavigate = vi.mocked(useNavigate);

const mockedGetCurrentWorkoutWeekNumber = vi.mocked(
  getCurrentWorkoutWeekNumber,
);

const mockedToastError = vi.mocked(toast.error);

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

type ActivePlan = NonNullable<
  ReturnType<typeof useActiveWorkoutPlanQuery>["data"]
>;

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const navigate = vi.fn();

const onClose = vi.fn();

const user: AuthUser = {
  uid: "user-1",
  firstName: "Michał",
  email: "michal@example.com",
  role: "user",
  onboardingCompleted: true,
  createdAt: new Date(2026, 9, 5),
};

const plan: ActivePlan = {
  id: "plan-1",
  uid: "user-1",
  name: "Plan treningowy",
  startDate: "2026-10-26",
  durationWeeks: 12,
  goal: "mass",
  trainingLocation: "gym",
  experienceLevel: "beginner",
  workoutDays: [],
  scheduleOverrides: [],
  status: "active",
  createdAt: new Date(2026, 9, 26),
  updatedAt: new Date(2026, 9, 26),
};

const renderSidebar = (isOpen = false) => {
  render(
    <MemoryRouter>
      <Sidebar isOpen={isOpen} onClose={onClose} />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();

  activePlan = undefined;

  mockedUseNavigate.mockReturnValue(navigate);

  mockedGetCurrentWorkoutWeekNumber.mockReturnValue(3);

  mockedUseAuth.mockReturnValue({
    user,
    isLoading: false,
    login,
    register,
    logout,
  });
});

describe("Sidebar", () => {
  it("renders navigation links", () => {
    renderSidebar();

    expect(
      screen.getByRole("link", {
        name: "Przegląd",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Kalendarz",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Mój plan",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Historia",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Postępy",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Profil",
      }),
    ).toBeInTheDocument();
  });

  it("links directly to plan when there is no active plan", () => {
    activePlan = undefined;

    renderSidebar();

    expect(
      screen.getByRole("link", {
        name: "Mój plan",
      }),
    ).toHaveAttribute("href", ROUTES.PLAN);
  });

  it("links to current week when active plan exists", () => {
    activePlan = plan;

    renderSidebar();

    expect(mockedGetCurrentWorkoutWeekNumber).toHaveBeenCalledWith(plan);

    expect(
      screen.getByRole("link", {
        name: "Mój plan",
      }),
    ).toHaveAttribute("href", `${ROUTES.PLAN}/week/3`);
  });

  it("closes sidebar after navigation link is clicked", async () => {
    const userEventInstance = userEvent.setup();

    renderSidebar(true);

    await userEventInstance.click(
      screen.getByRole("link", {
        name: "Przegląd",
      }),
    );

    expect(onClose).toHaveBeenCalledOnce();
  });

  it("logs out, closes sidebar and navigates to login page", async () => {
    const userEventInstance = userEvent.setup();

    logout.mockResolvedValue(undefined);

    renderSidebar();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Wyloguj się",
      }),
    );

    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce();
    });

    expect(onClose).toHaveBeenCalledOnce();

    expect(navigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it("shows error toast when logout fails", async () => {
    const userEventInstance = userEvent.setup();

    logout.mockRejectedValue(new Error("Logout failed"));

    renderSidebar();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Wyloguj się",
      }),
    );

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith(
        "Nie udało się wylogować użytkownika.",
      );
    });

    expect(onClose).not.toHaveBeenCalled();

    expect(navigate).not.toHaveBeenCalled();
  });
});
