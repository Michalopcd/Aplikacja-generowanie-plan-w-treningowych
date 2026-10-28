import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormError } from "./FormError";

describe("FormError", () => {
  it("renders the error message", () => {
    render(<FormError>Pole jest wymagane</FormError>);

    expect(screen.getByText("Pole jest wymagane")).toBeInTheDocument();
  });

  it("renders React elements passed as children", () => {
    render(
      <FormError>
        <span>Niepoprawna wartość</span>
      </FormError>,
    );

    expect(screen.getByText("Niepoprawna wartość")).toBeInTheDocument();
  });
});
