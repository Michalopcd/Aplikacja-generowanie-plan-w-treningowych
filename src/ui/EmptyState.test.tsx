import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("displays the default title and description", () => {
    render(<EmptyState />);

    expect(
      screen.getByText("Brak danych"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Nie ma jeszcze żadnych danych do wyświetlenia.",
      ),
    ).toBeInTheDocument();
  });

  it("displays a custom title and description", () => {
    render(
      <EmptyState
        title="Brak planu treningowego"
        description="Wygeneruj plan, aby rozpocząć treningi."
      />,
    );

    expect(
      screen.getByText(
        "Brak planu treningowego",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Wygeneruj plan, aby rozpocząć treningi.",
      ),
    ).toBeInTheDocument();
  });

  it("renders an action when it is provided", () => {
    render(
      <EmptyState
        action={
          <button type="button">
            Wygeneruj plan
          </button>
        }
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Wygeneruj plan",
      }),
    ).toBeInTheDocument();
  });
});