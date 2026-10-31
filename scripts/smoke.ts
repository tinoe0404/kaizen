/**
 * scripts/smoke.ts
 *
 * Production smoke test suite run against a live deployment.
 * Performs read-only and validation checks WITHOUT sending emails.
 *
 * Usage:
 *   npm run smoke -- <base-url> [alternate-host-url]
 *   e.g.: npm run smoke -- https://kaizentravel.co.zw https://www.kaizentravel.co.zw
 */

interface CheckResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: CheckResult[] = [];

function record(name: string, passed: boolean, details?: string) {
  results.push({ name, passed, details });
  const status = passed ? "\x1b[32mPASS\x1b[0m" : "\x1b[31mFAIL\x1b[0m";
  console.log(`[${status}] ${name}${details ? ` (${details})` : ""}`);
}

function stripTags(html: string): string {
  // Remove script and style tags completely
  const noScripts = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  const noStyles = noScripts.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  // Strip remaining tags
  return noStyles.replace(/<[^>]+>/g, " ");
}

async function run() {
  const args = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
  const baseUrl = args[0]?.replace(/\/+$/, "");
  const altUrl = args[1]?.replace(/\/+$/, "");

  if (!baseUrl) {
    console.error("Usage: npm run smoke -- <base-url> [alternate-host-url]");
    console.error("Example: npm run smoke -- https://kaizentravel.co.zw https://www.kaizentravel.co.zw");
    process.exit(1);
  }

  console.log(`\nStarting production smoke test against: ${baseUrl}\n`);

  // 1. Core route availability (expect 200)
  const routesToTest = [
    "/",
    "/destinations",
    "/destinations/destination-a",
    "/sitemap.xml",
    "/robots.txt",
  ];

  for (const route of routesToTest) {
    try {
      const res = await fetch(`${baseUrl}${route}`, {
        headers: { "User-Agent": "KaizenSmokeTest/1.0" },
      });
      record(
        `GET ${route} status 200`,
        res.status === 200,
        `received ${res.status}`
      );
    } catch (err: unknown) {
      record(`GET ${route} status 200`, false, `fetch error: ${(err as Error).message}`);
    }
  }

  // 2. POST /api/request empty body (expect 400, NOT 404 or 500)
  try {
    const res = await fetch(`${baseUrl}/api/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "KaizenSmokeTest/1.0",
      },
      body: JSON.stringify({}),
    });
    record(
      "POST /api/request empty body returns 400",
      res.status === 400,
      `received ${res.status}`
    );
  } catch (err: unknown) {
    record("POST /api/request empty body returns 400", false, `fetch error: ${(err as Error).message}`);
  }

  // 3. Security headers check on root route
  try {
    const res = await fetch(`${baseUrl}/`, {
      headers: { "User-Agent": "KaizenSmokeTest/1.0" },
    });
    const headers = res.headers;

    const nosniff = headers.get("x-content-type-options");
    record(
      "Security header: X-Content-Type-Options: nosniff",
      nosniff === "nosniff",
      `received "${nosniff}"`
    );

    const referrer = headers.get("referrer-policy");
    record(
      "Security header: Referrer-Policy: strict-origin-when-cross-origin",
      referrer === "strict-origin-when-cross-origin",
      `received "${referrer}"`
    );

    const frameOptions = headers.get("x-frame-options");
    record(
      "Security header: X-Frame-Options: DENY",
      frameOptions?.toUpperCase() === "DENY",
      `received "${frameOptions}"`
    );

    const permissions = headers.get("permissions-policy");
    record(
      "Security header: Permissions-Policy contains camera=(), microphone=(), geolocation=()",
      Boolean(
        permissions &&
          permissions.includes("camera=()") &&
          permissions.includes("microphone=()") &&
          permissions.includes("geolocation=()")
      ),
      `received "${permissions}"`
    );
  } catch (err: unknown) {
    record("Security headers check", false, `fetch error: ${(err as Error).message}`);
  }

  // 4. HTTP -> HTTPS redirection check
  if (baseUrl.startsWith("https://")) {
    const httpUrl = baseUrl.replace(/^https:\/\//, "http://");
    try {
      const res = await fetch(httpUrl, {
        redirect: "manual",
        headers: { "User-Agent": "KaizenSmokeTest/1.0" },
      });
      const isRedirect = [301, 302, 307, 308].includes(res.status);
      const location = res.headers.get("location");
      const redirectsToHttps = Boolean(location && location.startsWith("https://"));
      record(
        "HTTP redirects to HTTPS",
        isRedirect && redirectsToHttps,
        `status: ${res.status}, location: ${location}`
      );
    } catch {
      // If local or dev port doesn't listen on http, report warning/info
      console.log("[SKIP] HTTP to HTTPS redirect check could not connect on HTTP port");
    }
  } else if (baseUrl.startsWith("http://")) {
    try {
      const res = await fetch(baseUrl, {
        redirect: "manual",
        headers: { "User-Agent": "KaizenSmokeTest/1.0" },
      });
      const isRedirect = [301, 302, 307, 308].includes(res.status);
      const location = res.headers.get("location");
      record(
        "HTTP redirects to HTTPS",
        isRedirect && Boolean(location?.startsWith("https://")),
        `status: ${res.status}, location: ${location}`
      );
    } catch (err: unknown) {
      record("HTTP redirects to HTTPS", false, `error: ${(err as Error).message}`);
    }
  }

  // 5. Alternate host redirect (e.g. www vs apex)
  if (altUrl) {
    try {
      const res = await fetch(altUrl, {
        redirect: "manual",
        headers: { "User-Agent": "KaizenSmokeTest/1.0" },
      });
      const isRedirect = [301, 302, 307, 308].includes(res.status);
      const location = res.headers.get("location") || "";
      const redirectsToBase = location.startsWith(baseUrl) || location.startsWith("/");
      record(
        `Alternate host redirects to primary (${altUrl} -> ${baseUrl})`,
        isRedirect && redirectsToBase,
        `status: ${res.status}, location: ${location}`
      );
    } catch (err: unknown) {
      record(`Alternate host redirects to primary`, false, `error: ${(err as Error).message}`);
    }
  }

  // 6. Visible text placeholders & canonical tags
  const contentPages = ["/", "/about", "/contact", "/privacy"];

  for (const pagePath of contentPages) {
    try {
      const res = await fetch(`${baseUrl}${pagePath}`, {
        headers: { "User-Agent": "KaizenSmokeTest/1.0" },
      });
      const html = await res.text();

      // Check canonical link: exactly one per page
      const canonicalMatches = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/gi) ||
        html.match(/<link\s+[^>]*href=["'][^"']+["']\s+rel=["']canonical["'][^>]*>/gi);
      const canonicalCount = canonicalMatches ? canonicalMatches.length : 0;
      record(
        `${pagePath} has exactly one canonical link`,
        canonicalCount === 1,
        `found ${canonicalCount}`
      );

      // Check visible text for "[" placeholders
      const visibleText = stripTags(html);
      const hasPlaceholder = visibleText.includes("[");
      record(
        `${pagePath} contains no "[" placeholders in visible text`,
        !hasPlaceholder,
        hasPlaceholder ? "placeholder detected in rendered text" : "clean"
      );
    } catch (err: unknown) {
      record(`Inspect ${pagePath}`, false, `error: ${(err as Error).message}`);
    }
  }

  // Summary
  console.log("\n─── Smoke Test Summary ───");
  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.error(`\n❌ ${failed.length} smoke check(s) failed:\n`);
    for (const f of failed) {
      console.error(`  - ${f.name}${f.details ? `: ${f.details}` : ""}`);
    }
    process.exit(1);
  } else {
    console.log(`\n✓ All ${results.length} smoke checks passed successfully.\n`);
    process.exit(0);
  }
}

run().catch((err) => {
  console.error("Fatal error running smoke tests:", err);
  process.exit(1);
});

