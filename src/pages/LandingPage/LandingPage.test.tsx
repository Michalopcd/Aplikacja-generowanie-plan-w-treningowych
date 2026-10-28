import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/react";

import { MemoryRouter } from "react-router-dom";

import LandingPage from "./LandingPage";

const renderLandingPage = () => {
  render(
    <MemoryRouter>
      <LandingPage />
    </MemoryRouter>,
  );
};

describe("LandingPage", () => {
  it("renders the main page heading", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", {
        level: 1,
      }),
    ).toHaveTextContent(/Twój plan\.\s*Twój progres\./);
  });

  it("renders login and register links", () => {
    renderLandingPage();

    expect(
      screen.getByRole("link", {
        name: "Zaloguj się",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Załóż konto",
      }),
    ).toBeInTheDocument();
  });

  it("renders the main call to action links", () => {
    renderLandingPage();

    expect(
      screen.getByRole("link", {
        name: "Zacznij trenować",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Mam już konto",
      }),
    ).toBeInTheDocument();
  });

  it("renders the main application sections", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", {
        name: "Najpierw poznajemy Twoje potrzeby",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Przejrzysty plan na każdy tydzień",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Planuj i organizuj swoje treningi",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Najważniejsze informacje w jednym miejscu",
      }),
    ).toBeInTheDocument();
  });

  it("renders how it works steps", () => {
    renderLandingPage();

    expect(
      screen.getByRole("heading", {
        name: "Załóż konto",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Uzupełnij profil",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Wygeneruj plan",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Realizuj treningi",
      }),
    ).toBeInTheDocument();
  });
});
