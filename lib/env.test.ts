import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validateEnv, REQUIRED_PRODUCTION_VARS } from "./env";

describe("validateEnv", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("does not throw in development or preview when variables are missing", () => {
    delete process.env.VERCEL_ENV;
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    expect(() => validateEnv()).not.toThrow();

    process.env.VERCEL_ENV = "preview";
    expect(() => validateEnv()).not.toThrow();
  });

  it("fails when NEXT_PUBLIC_CONTENT_FIXTURES=1 in production", () => {
    process.env.VERCEL_ENV = "production";
    process.env.NEXT_PUBLIC_CONTENT_FIXTURES = "1";
    // even with all vars set
    for (const v of REQUIRED_PRODUCTION_VARS) {
      process.env[v] = "mock_value";
    }

    expect(() => validateEnv()).toThrowError(
      /NEXT_PUBLIC_CONTENT_FIXTURES=1 is forbidden in production/
    );
  });

  it("fails in production when any required variable is missing, reporting names only", () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.NEXT_PUBLIC_CONTENT_FIXTURES;

    // Delete all
    for (const v of REQUIRED_PRODUCTION_VARS) {
      delete process.env[v];
    }

    expect(() => validateEnv()).toThrowError(/Missing required production environment variables/);

    try {
      validateEnv();
    } catch (err: unknown) {
      const msg = (err as Error).message;
      for (const v of REQUIRED_PRODUCTION_VARS) {
        expect(msg).toContain(v);
      }
      // Never reveal any secret values
      expect(msg).not.toContain("mock_value");
    }
  });

  it("succeeds in production when all required variables are set", () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.NEXT_PUBLIC_CONTENT_FIXTURES;

    for (const v of REQUIRED_PRODUCTION_VARS) {
      process.env[v] = "valid_placeholder_value";
    }

    expect(() => validateEnv()).not.toThrow();
  });
});

