import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";

import { useTrainingPlan } from "../../features/training/hooks/useTrainingPlan";

import {
  formatDateToISO,
  formatISODateToDisplayDate,
  getWeekDayFromISODate,
} from "../../features/training/utils/dateUtils";
import { getCurrentWorkoutWeekNumber } from "../../features/training/utils/getCurrentWorkoutWeek";
import { createWorkoutKey } from "../../features/training/utils/workoutKey";
import { createWorkoutSchedule } from "../../features/training/utils/workoutSchedule";

import { ROUTES } from "../../utils/route";

import TrainingPlanPage from "./TrainingPlanPage";

vi.mock("../../features/training/hooks/useTrainingPlan", () => ({
  useTrainingPlan: vi.fn(),
}));

vi.mock("../../features/training/components/TrainingPlanPageSkeleton", () => ({
  TrainingPlanPageSkeleton: () => <div>Training plan loading</div>,
}));

vi.mock("../../features/training/utils/dateUtils", () => ({
  formatDateToISO: vi.fn(),
  formatISODateToDisplayDate: vi.fn((date: string) => `formatted-${date}`),
  getWeekDayFromISODate: vi.fn(),
}));

vi.mock("../../features/training/utils/getCurrentWorkoutWeek", () => ({
  getCurrentWorkoutWeekNumber: vi.fn(),
}));

vi.mock("../../features/training/utils/workoutKey", () => ({
  createWorkoutKey: vi.fn(),
}));

vi.mock("../../features/training/utils/workoutSchedule", () => ({
  createWorkoutSchedule: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedUseTrainingPlan = vi.mocked(useTrainingPlan);

const mockedUseNavigate = vi.mocked(useNavigate);

const mockedFormatDateToISO = vi.mocked(formatDateToISO);

const mockedFormatISODateToDisplayDate = vi.mocked(formatISODateToDisplayDate);

const mockedGetWeekDayFromISODate = vi.mocked(getWeekDayFromISODate);

const mockedGetCurrentWorkoutWeekNumber = vi.mocked(
  getCurrentWorkoutWeekNumber,
);

const mockedCreateWorkoutKey = vi.mocked(createWorkoutKey);

const mockedCreateWorkoutSchedule = vi.mocked(createWorkoutSchedule);

type TrainingPlan = NonNullable<ReturnType<typeof useTrainingPlan>["plan"]>;

type WorkoutSchedule = ReturnType<typeof createWorkoutSchedule>;

type ScheduledWorkout = WorkoutSchedule[number]["workouts"][number];

const TODAY = "2026-10-28";

const navigate = vi.fn();

const markWorkoutAsCompleted =
  vi.fn<ReturnType<typeof useTrainingPlan>["markWorkoutAsCompleted"]>();

const scheduledWorkout: ScheduledWorkout = {
  weekNumber: 1,
  trainingNumber: 1,
  scheduledDate: TODAY,

  workoutDay: {
    dayNumber: 1,
    weekDay: "wednesday",
    name: "Trening góry ciała",
    focusMuscleGroups: ["chest"],
    exercises: [],
  },
};

const workoutSchedule: WorkoutSchedule = [
  {
    weekNumber: 1,
    weekStartDate: "2026-10-26",
    weekEndDate: "2026-11-01",
    workouts: [scheduledWorkout],
  },
];

const plan: TrainingPlan = {
  id: "plan-1",
  uid: "user-1",
  name: "Plan treningowy",
  startDate: "2026-10-26",
  durationWeeks: 12,
  goal: "mass",
  trainingLocation: "gym",
  experienceLevel: "beginner",
  workoutDays: [scheduledWorkout.workoutDay],
  scheduleOverrides: [],
  status: "active",
  createdAt: new Date(2026, 9, 26),
  updatedAt: new Date(2026, 9, 26),
};

const renderTrainingPlanPage = (route = `${ROUTES.PLAN}/week/1`) => {
  render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route path={ROUTES.PLAN} element={<TrainingPlanPage />} />

        <Route
          path={`${ROUTES.PLAN}/week/:weekNumber`}
          element={<TrainingPlanPage />}
        />
      </Routes>
    </MemoryRouter>,
  );
};

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: vi.fn(),
});

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseNavigate.mockReturnValue(navigate);

  mockedFormatDateToISO.mockReturnValue(TODAY);

  mockedFormatISODateToDisplayDate.mockImplementation(
    (date: string) => `formatted-${date}`,
  );

  mockedGetWeekDayFromISODate.mockReturnValue("wednesday");

  mockedGetCurrentWorkoutWeekNumber.mockReturnValue(1);

  mockedCreateWorkoutKey.mockReturnValue("workout-key-1");

  mockedCreateWorkoutSchedule.mockReturnValue(workoutSchedule);

  mockedUseTrainingPlan.mockReturnValue({
    plan,
    today: TODAY,
    isLoading: false,
    errorMessage: "",
    savingWorkoutKey: null,
    completedWorkoutKeys: new Set(),
    markWorkoutAsCompleted,
  });
});

describe("TrainingPlanPage", () => {
  it("renders loading state", () => {
    mockedUseTrainingPlan.mockReturnValue({
      plan: null,
      today: TODAY,
      isLoading: true,
      errorMessage: "",
      savingWorkoutKey: null,
      completedWorkoutKeys: new Set(),
      markWorkoutAsCompleted,
    });

    renderTrainingPlanPage();

    expect(screen.getByText("Training plan loading")).toBeInTheDocument();
  });

  it("renders error state", () => {
    mockedUseTrainingPlan.mockReturnValue({
      plan: null,
      today: TODAY,
      isLoading: false,
      errorMessage: "Nie udało się pobrać planu.",
      savingWorkoutKey: null,
      completedWorkoutKeys: new Set(),
      markWorkoutAsCompleted,
    });

    renderTrainingPlanPage();

    expect(screen.getByText("Nie udało się pobrać planu.")).toBeInTheDocument();
  });

  it("renders empty state when there is no plan", () => {
    mockedUseTrainingPlan.mockReturnValue({
      plan: null,
      today: TODAY,
      isLoading: false,
      errorMessage: "",
      savingWorkoutKey: null,
      completedWorkoutKeys: new Set(),
      markWorkoutAsCompleted,
    });

    renderTrainingPlanPage();

    expect(screen.getByText("Brak planu treningowego")).toBeInTheDocument();
  });

  it("redirects to current week when route week is invalid", async () => {
    renderTrainingPlanPage(`${ROUTES.PLAN}/week/99`);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(`${ROUTES.PLAN}/week/1`, {
        replace: true,
      });
    });
  });

  it("renders selected workout week", () => {
    renderTrainingPlanPage();

    expect(
      screen.getByRole("heading", {
        name: "Twój plan treningowy",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("Tydzień 1")).toBeInTheDocument();

    expect(screen.getByText("Wybrany tydzień")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Trening góry ciała",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("0 ćwiczeń")).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Wróć do dashboardu",
      }),
    ).toBeInTheDocument();
  });

  it("marks today's workout as completed", async () => {
    const user = userEvent.setup();

    renderTrainingPlanPage();

    const button = screen.getByRole("button", {
      name: "Oznacz jako wykonany",
    });

    expect(button).toBeEnabled();

    await user.click(button);

    expect(markWorkoutAsCompleted).toHaveBeenCalledWith(scheduledWorkout);
  });
});
