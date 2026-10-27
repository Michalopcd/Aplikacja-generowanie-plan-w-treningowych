import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders the skeleton", () => {
    render(<Skeleton data-testid="skeleton" />);

    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Skeleton data-testid="skeleton" className="h-10 w-full" />);

    expect(screen.getByTestId("skeleton")).toHaveClass("h-10", "w-full");
  });

  it("passes native div props", () => {
    render(<Skeleton data-testid="skeleton" aria-label="Loading content" />);

    expect(screen.getByLabelText("Loading content")).toBeInTheDocument();
  });
});
