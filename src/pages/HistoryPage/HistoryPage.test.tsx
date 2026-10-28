import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { useWorkoutHistory } from "../../features/training/hooks/useWorkoutHistory";

import HistoryPage from "./HistoryPage";

vi.mock("../../features/training/hooks/useWorkoutHistory", () => ({
  useWorkoutHistory: vi.fn(),
}));

vi.mock("../../features/training/components/HistoryPageSkeleton", () => ({
  HistoryPageSkeleton: () => <div>History loading</div>,
}));

const mockedUseWorkoutHistory = vi.mocked(useWorkoutHistory);

type HistoryPlan = NonNullable<ReturnType<typeof useWorkoutHistory>["plan"]>;

type CompletedWorkout = ReturnType<
  typeof useWorkoutHistory
>["completedWorkouts"][number];

const plan: HistoryPlan = {
  id: "plan-1",
  uid: "user-1",
  name: "Plan na masę",
  startDate: "2026-10-05",
  durationWeeks: 12,
  goal: "mass",
  trainingLocation: "gym",
  experienceLevel: "beginner",
  workoutDays: [],
  scheduleOverrides: [],
  status: "active",
  createdAt: new Date(2026, 9, 5),
  updatedAt: new Date(2026, 9, 5),
};

const completedWorkout: CompletedWorkout = {
  id: "completed-1",
  uid: "user-1",
  workoutPlanId: "plan-1",
  workoutDayNumber: 1,
  workoutDayName: "Klatka piersiowa",
  weekNumber: 1,
  trainingNumber: 1,
  scheduledDate: "2026-10-05",
  completedDate: "2026-10-05",
  completedAt: new Date(2026, 9, 5, 18, 30),
  goal: "mass",
  exerciseCount: 3,
};

const renderHistoryPage = () => {
  render(
    <MemoryRouter>
      <HistoryPage />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("HistoryPage", () => {
  it("renders loading state", () => {
    mockedUseWorkoutHistory.mockReturnValue({
      plan: null,
      completedWorkouts: [],
      isLoading: true,
      errorMessage: "",
    });

    renderHistoryPage();

    expect(screen.getByText("History loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseWorkoutHistory.mockReturnValue({
      plan: null,
      completedWorkouts: [],
      isLoading: false,
      errorMessage: "Nie udało się pobrać historii treningów.",
    });

    renderHistoryPage();

    expect(
      screen.getByText("Nie udało się pobrać historii treningów."),
    ).toBeInTheDocument();
  });

  it("renders empty state when there is no active plan", () => {
    mockedUseWorkoutHistory.mockReturnValue({
      plan: null,
      completedWorkouts: [],
      isLoading: false,
      errorMessage: "",
    });

    renderHistoryPage();

    expect(screen.getByText("Brak aktywnego planu")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Przejdź do planu",
      }),
    ).toBeInTheDocument();
  });

  it("renders empty workout history when the plan has no completed workouts", () => {
    mockedUseWorkoutHistory.mockReturnValue({
      plan,
      completedWorkouts: [],
      isLoading: false,
      errorMessage: "",
    });

    renderHistoryPage();

    expect(
      screen.getByRole("heading", {
        name: "Historia wykonanych treningów",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Plan na masę")).toBeInTheDocument();

    expect(screen.getByText("Brak wykonanych treningów")).toBeInTheDocument();
  });

  it("renders completed workouts", () => {
    mockedUseWorkoutHistory.mockReturnValue({
      plan,
      completedWorkouts: [completedWorkout],
      isLoading: false,
      errorMessage: "",
    });

    renderHistoryPage();

    expect(screen.getByText("Klatka piersiowa")).toBeInTheDocument();

    expect(screen.getByText("Trening 1")).toBeInTheDocument();

    expect(screen.getByText("3 ćwiczeń")).toBeInTheDocument();

    expect(screen.getByText("Wykonany")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Wróć do dashboardu",
      }),
    ).toBeInTheDocument();
  });
});
