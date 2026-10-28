import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MemoryRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../features/auth/AuthContext";
import { getAuthErrorMessage } from "../../features/auth/errors/authErrors";

import { ROUTES } from "../../utils/route";

import RegisterPage from "./RegisterPage";

vi.mock("../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../features/auth/errors/authErrors", () => ({
  getAuthErrorMessage: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock("../layouts/AuthLayout/AuthLayout", () => ({
  AuthLayout: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockedUseAuth = vi.mocked(useAuth);

const mockedUseNavigate = vi.mocked(useNavigate);

const mockedGetAuthErrorMessage = vi.mocked(getAuthErrorMessage);

const mockedToastSuccess = vi.mocked(toast.success);

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const navigate = vi.fn();

const VALID_PASSWORD = "Password123!";

const renderRegisterPage = () => {
  render(
    <MemoryRouter>
      <RegisterPage />
    </MemoryRouter>,
  );
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseNavigate.mockReturnValue(navigate);

  mockedUseAuth.mockReturnValue({
    user: null,
    isLoading: false,
    login,
    register,
    logout,
  });

  mockedGetAuthErrorMessage.mockReturnValue("Nie udało się utworzyć konta.");
});

describe("RegisterPage", () => {
  it("renders the register form", () => {
    renderRegisterPage();

    expect(
      screen.getByRole("heading", {
        name: "Zarejestruj się",
      }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Hasło")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Powtórz hasło")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Zarejestruj się",
      }),
    ).toBeInTheDocument();
  });

  it("registers user and navigates to onboarding", async () => {
    const user = userEvent.setup();

    register.mockResolvedValue(undefined);

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText("E-mail"), "test@example.com");

    await user.type(screen.getByPlaceholderText("Hasło"), VALID_PASSWORD);

    await user.type(
      screen.getByPlaceholderText("Powtórz hasło"),
      VALID_PASSWORD,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Zarejestruj się",
      }),
    );

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("test@example.com", VALID_PASSWORD);
    });

    expect(mockedToastSuccess).toHaveBeenCalledWith(
      "Konto zostało utworzone.",
      {
        toastId: "register-success",
      },
    );

    expect(navigate).toHaveBeenCalledWith(ROUTES.ONBOARDING, {
      replace: true,
    });
  });

  it("does not submit the form when passwords are different", async () => {
    const user = userEvent.setup();

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText("E-mail"), "test@example.com");

    await user.type(screen.getByPlaceholderText("Hasło"), VALID_PASSWORD);

    await user.type(
      screen.getByPlaceholderText("Powtórz hasło"),
      "Different123!",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Zarejestruj się",
      }),
    );

    await waitFor(() => {
      expect(register).not.toHaveBeenCalled();
    });
  });

  it("shows an error message when registration fails", async () => {
    const user = userEvent.setup();

    register.mockRejectedValue(new Error("Register failed"));

    mockedGetAuthErrorMessage.mockReturnValue("Adres e-mail jest już zajęty.");

    renderRegisterPage();

    await user.type(screen.getByPlaceholderText("E-mail"), "test@example.com");

    await user.type(screen.getByPlaceholderText("Hasło"), VALID_PASSWORD);

    await user.type(
      screen.getByPlaceholderText("Powtórz hasło"),
      VALID_PASSWORD,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Zarejestruj się",
      }),
    );

    expect(
      await screen.findByText("Adres e-mail jest już zajęty."),
    ).toBeInTheDocument();

    expect(mockedGetAuthErrorMessage).toHaveBeenCalled();

    expect(navigate).not.toHaveBeenCalled();
  });

  it("renders a link to the login page", () => {
    renderRegisterPage();

    expect(
      screen.getByRole("link", {
        name: "Zaloguj się",
      }),
    ).toBeInTheDocument();
  });
});
