import {
  describe,
  expect,
  it,
} from "vitest";

import {
  render,
  screen,
} from "@testing-library/react";

import { LoadingState } from "./LoadingState";

describe("LoadingState", () => {
  it("displays the default loading message", () => {
    render(<LoadingState />);

    expect(
      screen.getByText("Ładowanie..."),
    ).toBeInTheDocument();
  });

  it("displays a custom loading message", () => {
    render(
      <LoadingState message="Ładowanie planu treningowego..." />,
    );

    expect(
      screen.getByText(
        "Ładowanie planu treningowego...",
      ),
    ).toBeInTheDocument();
  });
});