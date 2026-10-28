import { beforeEach, describe, expect, it, vi } from "vitest";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/AuthContext";
import { saveOnboardingData } from "../../features/auth/profileService";

import OnboardingPage from "./OnboardingPage";

vi.mock("../../features/auth/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../../features/auth/profileService", () => ({
  saveOnboardingData: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockedUseAuth = vi.mocked(useAuth);

const mockedSaveOnboardingData = vi.mocked(saveOnboardingData);

const mockedUseNavigate = vi.mocked(useNavigate);

type AuthUser = NonNullable<ReturnType<typeof useAuth>["user"]>;

const login = vi.fn<ReturnType<typeof useAuth>["login"]>();

const register = vi.fn<ReturnType<typeof useAuth>["register"]>();

const logout = vi.fn<ReturnType<typeof useAuth>["logout"]>();

const navigate = vi.fn();

const user: AuthUser = {
  uid: "user-1",
  firstName: "Michał",
  email: "michal@example.com",
  role: "user",
  onboardingCompleted: false,
  createdAt: new Date(2026, 9, 5),
};

const selectFirstAvailableOption = async (
  userEventInstance: ReturnType<typeof userEvent.setup>,
  select: HTMLSelectElement,
) => {
  const option = Array.from(select.options).find(
    (item) => !item.disabled && item.value !== "",
  );

  if (!option) {
    throw new Error("No available option found.");
  }

  await userEventInstance.selectOptions(select, option.value);

  return option.value;
};

const fillValidForm = async () => {
  const userEventInstance = userEvent.setup();

  await userEventInstance.type(
    screen.getByPlaceholderText("Podaj imię"),
    "Michał",
  );

  await userEventInstance.type(screen.getByPlaceholderText("Podaj wiek"), "25");

  await userEventInstance.type(
    screen.getByPlaceholderText("Podaj wzrost"),
    "180",
  );

  await userEventInstance.type(screen.getByPlaceholderText("Podaj wagę"), "85");

  const selects = screen.getAllByRole<HTMLSelectElement>("combobox");

  const [
    genderSelect,
    trainingLocationSelect,
    trainingDaysSelect,
    experienceLevelSelect,
    goalSelect,
  ] = selects;

  const gender = await selectFirstAvailableOption(
    userEventInstance,
    genderSelect,
  );

  const trainingLocation = await selectFirstAvailableOption(
    userEventInstance,
    trainingLocationSelect,
  );

  const trainingDaysPerWeek = await selectFirstAvailableOption(
    userEventInstance,
    trainingDaysSelect,
  );

  const experienceLevel = await selectFirstAvailableOption(
    userEventInstance,
    experienceLevelSelect,
  );

  const goal = await selectFirstAvailableOption(userEventInstance, goalSelect);

  return {
    userEventInstance,
    gender,
    trainingLocation,
    trainingDaysPerWeek,
    experienceLevel,
    goal,
  };
};

beforeEach(() => {
  vi.clearAllMocks();

  mockedUseNavigate.mockReturnValue(navigate);

  mockedUseAuth.mockReturnValue({
    user,
    isLoading: false,
    login,
    register,
    logout,
  });

  mockedSaveOnboardingData.mockResolvedValue(undefined);
});

describe("OnboardingPage", () => {
  it("renders the onboarding form", () => {
    render(<OnboardingPage />);

    expect(
      screen.getByRole("heading", {
        name: "Dopasujmy plan treningowy do Ciebie",
      }),
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Podaj imię")).toBeInTheDocument();

    expect(screen.getByPlaceholderText("Podaj wiek")).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Przejdź dalej",
      }),
    ).toBeInTheDocument();
  });

  it("saves onboarding data and navigates to dashboard", async () => {
    render(<OnboardingPage />);

    const {
      userEventInstance,
      gender,
      trainingLocation,
      trainingDaysPerWeek,
      experienceLevel,
      goal,
    } = await fillValidForm();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Przejdź dalej",
      }),
    );

    await waitFor(() => {
      expect(mockedSaveOnboardingData).toHaveBeenCalledWith(
        "user-1",
        "Michał",
        {
          age: 25,
          height: 180,
          weight: 85,
          gender,
          trainingLocation,
          trainingDaysPerWeek: Number(trainingDaysPerWeek),
          experienceLevel,
          goal,
        },
      );
    });

    expect(navigate).toHaveBeenCalledWith("/dashboard");
  });

  it("shows an error when there is no authenticated user", async () => {
    mockedUseAuth.mockReturnValue({
      user: null,
      isLoading: false,
      login,
      register,
      logout,
    });

    render(<OnboardingPage />);

    const { userEventInstance } = await fillValidForm();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Przejdź dalej",
      }),
    );

    expect(
      await screen.findByText("Nie znaleziono zalogowanego użytkownika."),
    ).toBeInTheDocument();

    expect(mockedSaveOnboardingData).not.toHaveBeenCalled();

    expect(navigate).not.toHaveBeenCalled();
  });

  it("shows an error when onboarding data cannot be saved", async () => {
    mockedSaveOnboardingData.mockRejectedValue(new Error("Save failed"));

    render(<OnboardingPage />);

    const { userEventInstance } = await fillValidForm();

    await userEventInstance.click(
      screen.getByRole("button", {
        name: "Przejdź dalej",
      }),
    );

    expect(
      await screen.findByText("Nie udało się zapisać danych profilu."),
    ).toBeInTheDocument();

    expect(navigate).not.toHaveBeenCalled();
  });
});
