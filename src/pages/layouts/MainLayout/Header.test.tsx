import { beforeEach, describe, expect, it, vi } from "vitest";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../../features/auth/AuthContext";

import type { UserProfile } from "../../../types/user";

import { ROUTES } from "../../../utils/route";

import { Header } from "./Header";

vi.mock("../../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockedUseAuth = vi.mocked(useAuth);

const mockedToastError = vi.mocked(toast.error);

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const onMenuClick = vi.fn();

const user: UserProfile = {
  uid: "user-1",
  firstName: "michał",
  email: "michal@example.com",
  role: "user",
  onboardingCompleted: true,
  createdAt: new Date(2026, 9, 5),
};

const renderHeader = () => {
  render(
    <MemoryRouter>
      <Header user={user} onMenuClick={onMenuClick} />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseAuth.mockReturnValue({
    user,
    isLoading: false,
    login,
    register,
    logout,
  });
});

describe("Header", () => {
  it("renders formatted user first name", () => {
    renderHeader();

    expect(screen.getByText("Michał")).toBeInTheDocument();

    expect(screen.getByText("Gotowy na kolejny trening?")).toBeInTheDocument();
  });

  it("calls onMenuClick when mobile menu button is clicked", async () => {
    const userEventInstance = userEvent.setup();

    renderHeader();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Otwórz menu",
      }),
    );

    expect(onMenuClick).toHaveBeenCalledOnce();
  });

  it("opens and closes user menu", async () => {
    const userEventInstance = userEvent.setup();

    renderHeader();

    const userMenuButton = screen.getByRole("button", {
      name: "Otwórz menu użytkownika",
    });

    expect(userMenuButton).toHaveAttribute("aria-expanded", "false");

    await userEventInstance.click(userMenuButton);

    expect(userMenuButton).toHaveAttribute("aria-expanded", "true");

    expect(
      screen.getByRole("link", {
        name: "Przejdź do profilu",
      }),
    ).toHaveAttribute("href", ROUTES.PROFILE);

    await userEventInstance.click(userMenuButton);

    expect(
      screen.queryByRole("link", {
        name: "Przejdź do profilu",
      }),
    ).not.toBeInTheDocument();
  });

  it("logs out the user", async () => {
    const userEventInstance = userEvent.setup();

    logout.mockResolvedValue(undefined);

    renderHeader();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Otwórz menu użytkownika",
      }),
    );

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Wyloguj się",
      }),
    );

    await waitFor(() => {
      expect(logout).toHaveBeenCalledOnce();
    });

    expect(
      screen.queryByRole("button", {
        name: "Wyloguj się",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows error toast when logout fails", async () => {
    const userEventInstance = userEvent.setup();

    logout.mockRejectedValue(new Error("Logout failed"));

    renderHeader();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Otwórz menu użytkownika",
      }),
    );

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Wyloguj się",
      }),
    );

    await waitFor(() => {
      expect(mockedToastError).toHaveBeenCalledWith("Nie udało się wylogować.");
    });
  });

  it("closes user menu after clicking outside", async () => {
    const userEventInstance = userEvent.setup();

    renderHeader();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Otwórz menu użytkownika",
      }),
    );

    expect(
      screen.getByRole("link", {
        name: "Przejdź do profilu",
      }),
    ).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(
      screen.queryByRole("link", {
        name: "Przejdź do profilu",
      }),
    ).not.toBeInTheDocument();
  });
});
