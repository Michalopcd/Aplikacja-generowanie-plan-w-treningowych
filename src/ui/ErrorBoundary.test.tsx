import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { ErrorBoundary } from "./ErrorBoundary";

const BrokenComponent = () => {
  throw new Error("Test error");
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders children when there is no error", () => {
    render(
      <ErrorBoundary>
        <p>Application content</p>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Application content")).toBeInTheDocument();
  });

  it("renders fallback content when a child throws an error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("heading", {
        name: "Coś poszło nie tak",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Wystąpił nieoczekiwany błąd aplikacji. Spróbuj odświeżyć stronę.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the reload button when an error occurs", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <BrokenComponent />
      </ErrorBoundary>,
    );

    expect(
      screen.getByRole("button", {
        name: "Odśwież stronę",
      }),
    ).toBeInTheDocument();
  });
});
