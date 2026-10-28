import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Home } from "lucide-react";

import { Link } from "./Link";

describe("Link", () => {
  it("renders the link content", () => {
    render(
      <MemoryRouter>
        <Link to="/dashboard" icon={Home}>
          Dashboard
        </Link>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).toBeInTheDocument();
  });

  it("uses the provided destination", () => {
    render(
      <MemoryRouter>
        <Link to="/dashboard" icon={Home}>
          Dashboard
        </Link>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).toHaveAttribute("href", "/dashboard");
  });

  it("applies active styles when the route is active", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Link to="/dashboard" icon={Home}>
          Dashboard
        </Link>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).toHaveClass("bg-surface", "text-white");
  });

  it("applies inactive styles when the route is not active", () => {
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <Link to="/dashboard" icon={Home}>
          Dashboard
        </Link>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", {
        name: "Dashboard",
      }),
    ).toHaveClass("text-muted");
  });
});
