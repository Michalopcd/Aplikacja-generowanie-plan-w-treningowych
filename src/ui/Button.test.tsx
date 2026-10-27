import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Save</Button>);

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Save</Button>);

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Save
      </Button>,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save",
      }),
    );

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("passes native button props", () => {
    render(
      <Button type="submit" aria-label="Submit form">
        Save
      </Button>,
    );

    const button = screen.getByRole("button", {
      name: "Submit form",
    });

    expect(button).toHaveAttribute("type", "submit");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Save</Button>);

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toHaveClass("custom-class");
  });

  it("applies the selected variant", () => {
    render(<Button variant="success">Save</Button>);

    expect(
      screen.getByRole("button", {
        name: "Save",
      }),
    ).toHaveClass("bg-green-500");
  });
});
