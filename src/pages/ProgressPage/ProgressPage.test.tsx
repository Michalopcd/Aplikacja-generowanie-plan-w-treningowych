import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { useProgressData } from "../../features/training/hooks/useProgressData";

import { formatDateToISO } from "../../features/training/utils/dateUtils";
import { createProgressStats } from "../../features/training/utils/progressStats";
import { createWorkoutSchedule } from "../../features/training/utils/workoutSchedule";

import ProgressPage from "./ProgressPage";

vi.mock("../../features/training/hooks/useProgressData", () => ({
  useProgressData: vi.fn(),
}));

vi.mock("../../features/training/components/ProgressPageSkeleton", () => ({
  ProgressPageSkeleton: () => <div>Progress loading</div>,
}));

vi.mock("../../features/training/utils/dateUtils", () => ({
  formatDateToISO: vi.fn(),
  formatISODateToDisplayDate: vi.fn((date: string) => `formatted-${date}`),
}));

vi.mock("../../features/training/utils/progressStats", () => ({
  createProgressStats: vi.fn(),
}));

vi.mock("../../features/training/utils/workoutSchedule", () => ({
  createWorkoutSchedule: vi.fn(),
}));

const mockedUseProgressData = vi.mocked(useProgressData);

const mockedFormatDateToISO = vi.mocked(formatDateToISO);

const mockedCreateProgressStats = vi.mocked(createProgressStats);

const mockedCreateWorkoutSchedule = vi.mocked(createWorkoutSchedule);

type ProgressPlan = NonNullable<ReturnType<typeof useProgressData>["plan"]>;

type CompletedWorkout = ReturnType<
  typeof useProgressData
>["completedWorkouts"][number];

type WorkoutSchedule = ReturnType<typeof createWorkoutSchedule>;

type ProgressStats = ReturnType<typeof createProgressStats>;

const plan: ProgressPlan = {
  id: "plan-1",
  uid: "user-1",
  name: "Plan treningowy",
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
  scheduledDate: "2026-10-06",
  completedDate: "2026-10-06",
  completedAt: new Date(2026, 9, 6, 18),
  goal: "mass",
  exerciseCount: 3,
};

const workoutSchedule: WorkoutSchedule = [
  {
    weekNumber: 1,
    weekStartDate: "2026-10-05",
    weekEndDate: "2026-10-11",
    workouts: [],
  },
];

const progressStats: ProgressStats = {
  plannedWorkoutsCount: 12,
  completedWorkoutsCount: 3,
  completionPercentage: 25,
  currentWeekCompletedWorkoutsCount: 1,
};

const renderProgressPage = () => {
  render(
    <MemoryRouter>
      <ProgressPage />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedFormatDateToISO.mockReturnValue("2026-10-08");

  mockedCreateWorkoutSchedule.mockReturnValue(workoutSchedule);

  mockedCreateProgressStats.mockReturnValue(progressStats);
});

describe("ProgressPage", () => {
  it("renders loading state", () => {
    mockedUseProgressData.mockReturnValue({
      plan: null,
      completedWorkouts: [],
      isLoading: true,
      errorMessage: "",
    });

    renderProgressPage();

    expect(screen.getByText("Progress loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseProgressData.mockReturnValue({
      plan: null,
      completedWorkouts: [],
      isLoading: false,
      errorMessage: "Nie udało się pobrać postępów.",
    });

    renderProgressPage();

    expect(
      screen.getByText("Nie udało się pobrać postępów."),
    ).toBeInTheDocument();
  });

  it("renders empty state when there is no active plan", () => {
    mockedUseProgressData.mockReturnValue({
      plan: null,
      completedWorkouts: [],
      isLoading: false,
      errorMessage: "",
    });

    renderProgressPage();

    expect(screen.getByText("Brak aktywnego planu")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Przejdź do planu",
      }),
    ).toBeInTheDocument();
  });

  it("renders progress statistics for active plan", () => {
    mockedUseProgressData.mockReturnValue({
      plan,
      completedWorkouts: [completedWorkout],
      isLoading: false,
      errorMessage: "",
    });

    renderProgressPage();

    expect(
      screen.getByRole("heading", {
        name: "Statystyki planu treningowego",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("25%")).toBeInTheDocument();

    expect(screen.getByText("Tydzień 1")).toBeInTheDocument();

    expect(
      screen.getByText("Trening 1 — Klatka piersiowa"),
    ).toBeInTheDocument();

    expect(screen.getByText("3 ćwiczeń")).toBeInTheDocument();
  });

  it("renders empty state when there are no completed workouts", () => {
    mockedUseProgressData.mockReturnValue({
      plan,
      completedWorkouts: [],
      isLoading: false,
      errorMessage: "",
    });

    renderProgressPage();

    expect(screen.getByText("Brak wykonanych treningów")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Wróć do dashboardu",
      }),
    ).toBeInTheDocument();
  });
});
