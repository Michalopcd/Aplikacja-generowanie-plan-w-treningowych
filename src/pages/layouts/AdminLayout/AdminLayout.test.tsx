import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useAuth } from "../../../features/auth/AuthContext";

import { AdminLayout } from "./AdminLayout";

vi.mock("../../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const user: AuthUser = {
  uid: "admin-1",
  firstName: "Michał",
  email: "admin@example.com",
  role: "admin",
  onboardingCompleted: true,
  createdAt: new Date(2026, 9, 5),
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

describe("AdminLayout", () => {
  it("renders children", () => {
    render(
      <AdminLayout>
        <p>Admin page content</p>
      </AdminLayout>,
    );

    expect(screen.getByText("Admin page content")).toBeInTheDocument();
  });

  it("renders admin data", () => {
    render(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    expect(screen.getByText("Michał")).toBeInTheDocument();

    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });

  it("logs out the user", async () => {
    const userEventInstance = userEvent.setup();

    render(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Wyloguj się",
      }),
    );

    expect(logout).toHaveBeenCalledOnce();
  });

  it("opens and closes the mobile menu", async () => {
    const userEventInstance = userEvent.setup();

    render(
      <AdminLayout>
        <p>Content</p>
      </AdminLayout>,
    );

    expect(screen.getAllByText("Ćwiczenia")).toHaveLength(1);

    const menuButton = screen.getByRole("button", {
      name: "Otwórz menu",
    });

    await userEventInstance.click(menuButton);

    expect(screen.getAllByText("Ćwiczenia")).toHaveLength(2);

    await userEventInstance.click(menuButton);

    expect(screen.getAllByText("Ćwiczenia")).toHaveLength(1);
  });
});
