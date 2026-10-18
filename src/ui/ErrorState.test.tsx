import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("displays the default error message", () => {
    render(<ErrorState />);

    expect(
      screen.getByText(
        "Wystąpił błąd podczas pobierania danych.",
      ),
    ).toBeInTheDocument();
  });

  it("displays a custom error message", () => {
    render(
      <ErrorState message="Nie udało się pobrać planu treningowego." />,
    );

    expect(
      screen.getByText(
        "Nie udało się pobrać planu treningowego.",
      ),
    ).toBeInTheDocument();
  });
});