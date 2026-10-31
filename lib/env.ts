/**
 * Environment validation module.
 *
 * Validates required environment variables at build time and runtime.
 * Strict rules:
 * - Only names are reported in error messages, NEVER values.
 * - In production (VERCEL_ENV === "production"), all required variables must be present.
 * - Test fixtures (NEXT_PUBLIC_CONTENT_FIXTURES === "1") must NEVER be enabled in production.
 */

export const REQUIRED_PRODUCTION_VARS = [
  "NEXT_PUBLIC_SITE_URL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASS",
  "MAIL_FROM_NAME",
  "BOOKING_EMAIL",
] as const;

export function validateEnv(): void {
  const isProduction = process.env.VERCEL_ENV === "production";
  const useFixtures = process.env.NEXT_PUBLIC_CONTENT_FIXTURES === "1";

  // Safety: fail if fixtures are active in production
  if (useFixtures && isProduction) {
    throw new Error(
      "Build failed: NEXT_PUBLIC_CONTENT_FIXTURES=1 is forbidden in production (VERCEL_ENV=production)."
    );
  }

  // Only enforce strict presence in production
  if (!isProduction) {
    return;
  }

  const missing: string[] = [];
  for (const varName of REQUIRED_PRODUCTION_VARS) {
    const val = process.env[varName];
    if (!val || val.trim() === "") {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Build failed: Missing required production environment variables (VERCEL_ENV=production):\n` +
        missing.map((v) => `  - ${v}`).join("\n") +
        `\nPlease configure these variables in your deployment environment.`
    );
  }
}

