import { describe, expect, it } from "vitest";

import { registerSchema } from "./registerSchema";

const createValidRegisterData = () => {
  return {
    email: "michal@example.com",
    password: "Test123!",
    confirmPassword: "Test123!",
  };
};

describe("registerSchema", () => {
  it("accepts valid registration data", async () => {
    const result = await registerSchema.isValid(createValidRegisterData());

    expect(result).toBe(true);
  });

  it("rejects an invalid email address", async () => {
    const result = await registerSchema.isValid({
      ...createValidRegisterData(),
      email: "invalid-email",
    });

    expect(result).toBe(false);
  });

  it.each([
    ["Test1!", "password shorter than eight characters"],
    ["test123!", "password without uppercase letter"],
    ["TEST123!", "password without lowercase letter"],
    ["TestTest!", "password without number"],
    ["Test1234", "password without special character"],
  ])("rejects %s because it is a %s", async (password) => {
    const result = await registerSchema.isValid({
      ...createValidRegisterData(),
      password,
      confirmPassword: password,
    });

    expect(result).toBe(false);
  });

  it("rejects passwords that do not match", async () => {
    const result = await registerSchema.isValid({
      ...createValidRegisterData(),
      confirmPassword: "Different123!",
    });

    expect(result).toBe(false);
  });

  it("rejects an empty email", async () => {
    const result = await registerSchema.isValid({
      ...createValidRegisterData(),
      email: "",
    });

    expect(result).toBe(false);
  });

  it("rejects an empty password", async () => {
    const result = await registerSchema.isValid({
      ...createValidRegisterData(),
      password: "",
    });

    expect(result).toBe(false);
  });

  it("rejects an empty password confirmation", async () => {
    const result = await registerSchema.isValid({
      ...createValidRegisterData(),
      confirmPassword: "",
    });

    expect(result).toBe(false);
  });
});
