import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { useAuth } from "../../features/auth/AuthContext";

import DashboardPage from "./DashboardPage";

vi.mock("../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../features/dashboard/components/DashboardPageSkeleton", () => ({
  DashboardPageSkeleton: () => <div>Dashboard loading</div>,
}));

vi.mock("../../features/dashboard/components/DashboardStatsSection", () => ({
  DashboardStatsSection: ({ uid }: { uid: string }) => (
    <div>Dashboard stats {uid}</div>
  ),
}));

vi.mock(
  "../../features/dashboard/components/DashboardWorkoutReminderCard",
  () => ({
    DashboardWorkoutReminderCard: ({ uid }: { uid: string }) => (
      <div>Workout reminder {uid}</div>
    ),
  }),
);

vi.mock(
  "../../features/dashboard/components/DashboardRecentActivityCard",
  () => ({
    DashboardRecentActivityCard: ({ uid }: { uid: string }) => (
      <div>Recent activity {uid}</div>
    ),
  }),
);

vi.mock("../../features/dashboard/components/DashboardPlanProgress", () => ({
  default: ({ uid }: { uid: string }) => <div>Plan progress {uid}</div>,
}));

const mockedUseAuth = vi.mocked(useAuth);

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const user: AuthUser = {
  uid: "user-1",
  firstName: "Michał",
  email: "michal@example.com",
  role: "user",
  onboardingCompleted: true,
  createdAt: new Date(2026, 9, 5),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("DashboardPage", () => {
  it("renders loading state", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login,
      register,
      logout,
    });

    render(<DashboardPage />);

    expect(screen.getByText("Dashboard loading")).toBeInTheDocument();
  });

  it("renders nothing when the user is not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login,
      register,
      logout,
    });

    const { container } = render(<DashboardPage />);

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the dashboard for an authenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user,
      isLoading: false,
      login,
      register,
      logout,
    });

    render(<DashboardPage />);

    expect(
      screen.getByRole("heading", {
        name: "Przegląd treningów",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Sprawdź swoje najważniejsze statystyki, regularność i postęp w aktualnym planie treningowym.",
      ),
    ).toBeInTheDocument();
  });

  it("passes the user uid to dashboard sections", () => {
    mockedUseAuth.mockReturnValue({
      user,
      isLoading: false,
      login,
      register,
      logout,
    });

    render(<DashboardPage />);

    expect(screen.getByText("Dashboard stats user-1")).toBeInTheDocument();

    expect(screen.getByText("Workout reminder user-1")).toBeInTheDocument();

    expect(screen.getByText("Recent activity user-1")).toBeInTheDocument();

    expect(screen.getByText("Plan progress user-1")).toBeInTheDocument();
  });
});
