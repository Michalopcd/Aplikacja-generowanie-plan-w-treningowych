import { describe, expect, it } from "vitest";

import { render, screen } from "@testing-library/react";

import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("renders children", () => {
    render(
      <AuthLayout hero={<p>Hero content</p>} heroImage="/hero.jpg">
        <p>Form content</p>
      </AuthLayout>,
    );

    expect(screen.getByText("Form content")).toBeInTheDocument();
  });

  it("renders hero content", () => {
    render(
      <AuthLayout hero={<p>Hero content</p>} heroImage="/hero.jpg">
        <p>Form content</p>
      </AuthLayout>,
    );

    expect(screen.getByText("Hero content")).toBeInTheDocument();
  });

  it("uses the provided hero image as background", () => {
    render(
      <AuthLayout hero={<p>Hero content</p>} heroImage="/hero.jpg">
        <p>Form content</p>
      </AuthLayout>,
    );

    const heroContent = screen.getByText("Hero content");

    const heroSection = heroContent.parentElement?.parentElement;

    expect(heroSection).toHaveStyle({
      backgroundImage: expect.stringContaining("url(/hero.jpg)"),
    });
  });

  it("changes desktop order when hero position is left", () => {
    render(
      <AuthLayout
        hero={<p>Hero content</p>}
        heroImage="/hero.jpg"
        heroPosition="left"
      >
        <p>Form content</p>
      </AuthLayout>,
    );

    const formContent = screen.getByText("Form content");

    const formSection = formContent.parentElement?.parentElement;

    const heroContent = screen.getByText("Hero content");

    const heroSection = heroContent.parentElement?.parentElement;

    expect(formSection).toHaveClass("lg:order-2");

    expect(heroSection).toHaveClass("lg:order-1");
  });
});
