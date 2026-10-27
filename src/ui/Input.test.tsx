import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Input } from "./Input";

describe("Input", () => {
  it("renders the input", () => {
    render(<Input placeholder="Email" />);

    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
  });

  it("passes native input props", () => {
    render(<Input type="email" name="email" placeholder="Email" />);

    const input = screen.getByPlaceholderText("Email");

    expect(input).toHaveAttribute("type", "email");

    expect(input).toHaveAttribute("name", "email");
  });

  it("renders an error message", () => {
    render(<Input placeholder="Email" error="Niepoprawny email" />);

    expect(screen.getByText("Niepoprawny email")).toBeInTheDocument();
  });

  it("does not render an error message when error is not provided", () => {
    render(<Input placeholder="Email" />);

    expect(screen.queryByText("Niepoprawny email")).not.toBeInTheDocument();
  });

  it("supports the disabled state", () => {
    render(<Input placeholder="Email" disabled />);

    expect(screen.getByPlaceholderText("Email")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Input placeholder="Email" className="custom-class" />);

    expect(screen.getByPlaceholderText("Email")).toHaveClass("custom-class");
  });
});
