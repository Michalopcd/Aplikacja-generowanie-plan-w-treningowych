import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";

import NotFoundPage from "./NotFoundPage";

vi.mock("../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
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

const renderNotFoundPage = () => {
  render(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("NotFoundPage", () => {
  it("renders the not found message", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login,
      register,
      logout,
    });

    renderNotFoundPage();

    expect(screen.getByText("Błąd 404")).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Nie znaleziono strony",
      }),
    ).toBeInTheDocument();
  });

  it("renders home link for unauthenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login,
      register,
      logout,
    });

    renderNotFoundPage();

    expect(
      screen.getByRole("link", {
        name: "Wróć na stronę główną",
      }),
    ).toHaveAttribute("href", "/");
  });

  it("renders dashboard link for authenticated user", () => {
    mockedUseAuth.mockReturnValue({
      user,
      isLoading: false,
      login,
      register,
      logout,
    });

    renderNotFoundPage();

    expect(
      screen.getByRole("link", {
        name: "Wróć do dashboardu",
      }),
    ).toHaveAttribute("href", "/dashboard");
  });

  it("does not render navigation link while auth is loading", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: true,
      login,
      register,
      logout,
    });

    renderNotFoundPage();

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
