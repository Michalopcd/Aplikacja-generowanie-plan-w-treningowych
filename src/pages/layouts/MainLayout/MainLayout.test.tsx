import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter, Route, Routes } from "react-router-dom";

import { useAuth } from "../../../features/auth/AuthContext";

import type { UserProfile } from "../../../types/user";

import { MainLayout } from "./MainLayout";

vi.mock("../../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("./Header", () => ({
  Header: ({
    user,
    onMenuClick,
  }: {
    user: UserProfile;
    onMenuClick: () => void;
  }) => (
    <div>
      <p>Header {user.firstName}</p>

      <button type="button" onClick={onMenuClick}>
        Open sidebar
      </button>
    </div>
  ),
}));

vi.mock("./Sidebar", () => ({
  Sidebar: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div>
      <p>{isOpen ? "Sidebar open" : "Sidebar closed"}</p>

      {isOpen && (
        <button type="button" onClick={onClose}>
          Close sidebar
        </button>
      )}
    </div>
  ),
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

const renderMainLayout = () => {
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<p>Dashboard content</p>} />
        </Route>
      </Routes>
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

describe("MainLayout", () => {
  it("renders nothing when user is not authenticated", () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login,
      register,
      logout,
    });

    const { container } = render(
      <MemoryRouter>
        <MainLayout />
      </MemoryRouter>,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders header, sidebar and outlet content", () => {
    renderMainLayout();

    expect(screen.getByText("Header Michał")).toBeInTheDocument();

    expect(screen.getByText("Sidebar closed")).toBeInTheDocument();

    expect(screen.getByText("Dashboard content")).toBeInTheDocument();
  });

  it("opens sidebar from header", async () => {
    const userEventInstance = userEvent.setup();

    renderMainLayout();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Open sidebar",
      }),
    );

    expect(screen.getByText("Sidebar open")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Zamknij menu",
      }),
    ).toBeInTheDocument();
  });

  it("closes sidebar after clicking overlay", async () => {
    const userEventInstance = userEvent.setup();

    renderMainLayout();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Open sidebar",
      }),
    );

    expect(screen.getByText("Sidebar open")).toBeInTheDocument();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Zamknij menu",
      }),
    );

    expect(screen.getByText("Sidebar closed")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", {
        name: "Zamknij menu",
      }),
    ).not.toBeInTheDocument();
  });
});
