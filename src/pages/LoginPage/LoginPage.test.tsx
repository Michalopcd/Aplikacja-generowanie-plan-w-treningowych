import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import { getAuthErrorMessage } from "../../features/auth/errors/authErrors";

import LoginPage from "./LoginPage";

vi.mock("../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../features/auth/errors/authErrors", () => ({
  getAuthErrorMessage: vi.fn(),
}));

vi.mock("../layouts/AuthLayout/AuthLayout", () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockedUseAuth = vi.mocked(useAuth);

const mockedGetAuthErrorMessage = vi.mocked(getAuthErrorMessage);

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const renderLoginPage = () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseAuth.mockReturnValue({
    user: null,
    isLoading: false,
    login,
    register,
    logout,
  });

  mockedGetAuthErrorMessage.mockReturnValue("Nieprawidłowy e-mail lub hasło.");
});

describe("LoginPage", () => {
  it("renders the login form", () => {
    renderLoginPage();

    expect(
      screen.getByRole("heading", {
        name: "Zaloguj się",
      }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Zaloguj się",
      }),
    ).toBeInTheDocument();
  });

  it("logs in with entered email and password", async () => {
    const user = userEvent.setup();

    login.mockResolvedValue(undefined);

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("E-mail"), "test@example.com");

    await user.type(screen.getByPlaceholderText("Hasło"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Zaloguj się",
      }),
    );

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith("test@example.com", "password123");
    });
  });

  it("does not submit the form when email is invalid", async () => {
    const user = userEvent.setup();

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("E-mail"), "invalid-email");

    await user.type(screen.getByPlaceholderText("Hasło"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Zaloguj się",
      }),
    );

    await waitFor(() => {
      expect(login).not.toHaveBeenCalled();
    });
  });

  it("renders an error message when login fails", async () => {
    const user = userEvent.setup();

    login.mockRejectedValue(new Error("Login failed"));

    renderLoginPage();

    await user.type(screen.getByPlaceholderText("E-mail"), "test@example.com");

    await user.type(screen.getByPlaceholderText("Hasło"), "password123");

    await user.click(
      screen.getByRole("button", {
        name: "Zaloguj się",
      }),
    );

    expect(
      await screen.findByText("Nieprawidłowy e-mail lub hasło."),
    ).toBeInTheDocument();

    expect(mockedGetAuthErrorMessage).toHaveBeenCalled();
  });

  it("renders a link to the register page", () => {
    renderLoginPage();

    expect(
      screen.getByRole("link", {
        name: "Zarejestruj się",
      }),
    ).toBeInTheDocument();
  });
});
