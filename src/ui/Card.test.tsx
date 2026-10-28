import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);

    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("passes native div props", () => {
    render(<Card data-testid="card">Card content</Card>);

    expect(screen.getByTestId("card")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Card data-testid="card" className="mt-4">
        Card content
      </Card>,
    );

    expect(screen.getByTestId("card")).toHaveClass("mt-4");
  });

  it("merges conflicting Tailwind classes", () => {
    render(
      <Card data-testid="card" className="p-8">
        Card content
      </Card>,
    );

    const card = screen.getByTestId("card");

    expect(card).toHaveClass("p-8");

    expect(card).not.toHaveClass("p-4");
  });
});
