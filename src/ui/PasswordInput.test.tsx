import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PasswordInput } from "./PasswordInput";

describe("PasswordInput", () => {
  it("renders the input as password by default", () => {
    render(<PasswordInput placeholder="Hasło" />);

    expect(screen.getByPlaceholderText("Hasło")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("shows the password after clicking the show password button", async () => {
    const user = userEvent.setup();

    render(<PasswordInput placeholder="Hasło" />);

    await user.click(
      screen.getByRole("button", {
        name: "Pokaż hasło",
      }),
    );

    expect(screen.getByPlaceholderText("Hasło")).toHaveAttribute(
      "type",
      "text",
    );

    expect(
      screen.getByRole("button", {
        name: "Ukryj hasło",
      }),
    ).toBeInTheDocument();
  });

  it("hides the password after clicking the button again", async () => {
    const user = userEvent.setup();

    render(<PasswordInput placeholder="Hasło" />);

    const showPasswordButton = screen.getByRole("button", {
      name: "Pokaż hasło",
    });

    await user.click(showPasswordButton);

    await user.click(
      screen.getByRole("button", {
        name: "Ukryj hasło",
      }),
    );

    expect(screen.getByPlaceholderText("Hasło")).toHaveAttribute(
      "type",
      "password",
    );

    expect(
      screen.getByRole("button", {
        name: "Pokaż hasło",
      }),
    ).toBeInTheDocument();
  });

  it("renders an error message", () => {
    render(<PasswordInput placeholder="Hasło" error="Hasło jest wymagane" />);

    expect(screen.getByText("Hasło jest wymagane")).toBeInTheDocument();
  });

  it("passes native input props", () => {
    render(<PasswordInput placeholder="Hasło" name="password" disabled />);

    const input = screen.getByPlaceholderText("Hasło");

    expect(input).toHaveAttribute("name", "password");

    expect(input).toBeDisabled();
  });
});
