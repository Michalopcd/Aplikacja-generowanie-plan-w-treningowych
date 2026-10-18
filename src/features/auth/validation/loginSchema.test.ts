import { describe, expect, it } from "vitest";

import { loginSchema } from "./loginSchema";

const createValidLoginData = () => {
  return {
    email: "michal@example.com",
    password: "Test123!",
  };
};

describe("loginSchema", () => {
  it("accepts valid login data", async () => {
    const result = await loginSchema.isValid(createValidLoginData());

    expect(result).toBe(true);
  });

  it("rejects an invalid email address", async () => {
    const result = await loginSchema.isValid({
      ...createValidLoginData(),
      email: "invalid-email",
    });

    expect(result).toBe(false);
  });

  it("rejects an empty email", async () => {
    const result = await loginSchema.isValid({
      ...createValidLoginData(),
      email: "",
    });

    expect(result).toBe(false);
  });

  it("rejects an empty password", async () => {
    const result = await loginSchema.isValid({
      ...createValidLoginData(),
      password: "",
    });

    expect(result).toBe(false);
  });
});
