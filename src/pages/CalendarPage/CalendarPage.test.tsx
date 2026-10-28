import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { useWorkoutCalendar } from "../../features/training/hooks/useWorkoutCalendar";

import type { WorkoutPlan } from "../../features/training/trainingPlan";

import CalendarPage from "./CalendarPage";

vi.mock("../../features/training/hooks/useWorkoutCalendar", () => ({
  useWorkoutCalendar: vi.fn(),
}));

vi.mock("@tanstack/react-query", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-query")>();

  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

vi.mock("@fullcalendar/react", () => ({
  default: () => <div>Workout calendar</div>,
}));

vi.mock("../../features/training/components/CalendarPageSkeleton", () => ({
  CalendarPageSkeleton: () => <div>Calendar loading</div>,
}));

vi.mock("../../features/training/components/WorkoutDetailsContent", () => ({
  WorkoutDetailsContent: () => <div>Workout details</div>,
}));

const mockedUseWorkoutCalendar = vi.mocked(useWorkoutCalendar);

const mockedUseQueryClient = vi.mocked(useQueryClient);

const queryClient = new QueryClient();

const updateWorkoutDate = vi.fn(async (): Promise<void> => {});

const plan: WorkoutPlan = {
  id: "plan-1",
  uid: "user-1",
  name: "Test workout plan",
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

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);

  mockedUseQueryClient.mockReturnValue(queryClient);
});

describe("CalendarPage", () => {
  it("renders loading state", () => {
    mockedUseWorkoutCalendar.mockReturnValue({
      plan: null,
      completedWorkoutKeys: new Set(),
      isLoading: true,
      errorMessage: "",
      updateWorkoutDate,
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Calendar loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseWorkoutCalendar.mockReturnValue({
      plan: null,
      completedWorkoutKeys: new Set(),
      isLoading: false,
      errorMessage: "Nie udało się pobrać kalendarza.",
      updateWorkoutDate,
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Nie udało się pobrać kalendarza."),
    ).toBeInTheDocument();
  });

  it("renders empty state when there is no active plan", () => {
    mockedUseWorkoutCalendar.mockReturnValue({
      plan: null,
      completedWorkoutKeys: new Set(),
      isLoading: false,
      errorMessage: "",
      updateWorkoutDate,
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Brak aktywnego planu")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Przejdź do planu",
      }),
    ).toBeInTheDocument();
  });

  it("renders the calendar when an active plan exists", () => {
    mockedUseWorkoutCalendar.mockReturnValue({
      plan,
      completedWorkoutKeys: new Set(),
      isLoading: false,
      errorMessage: "",
      updateWorkoutDate,
    });

    render(
      <MemoryRouter>
        <CalendarPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Kalendarz treningów",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Aktywny plan treningowy rozpisany na 12 tygodni. Kliknij trening w kalendarzu, aby zobaczyć szczegóły jednostki.",
      ),
    ).toBeInTheDocument();

    expect(screen.getByText("Workout calendar")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Wróć do dashboardu",
      }),
    ).toBeInTheDocument();
  });
});
