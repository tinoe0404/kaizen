import { describe, it, expect } from "vitest";
import { escapeHtml, buildTeamEmail, buildGuestEmail } from "./emails";
import { computeRequestSummary, RequestPayload } from "./request";
import { site } from "@/content/site";

function makeTestData(overrides: Partial<RequestPayload> = {}): RequestPayload {
  return {
    ids: ["destination-a", "activity-a"],
    arrival: "2026-11-10",
    departure: "2026-11-15",
    guests: 2,
    currency: "USD",
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "+263 71 000 0000",
    message: "Special request: vegan meals",
    website: "",
    openedAt: 123456789,
    ...overrides,
  };
}

describe("Email Builders", () => {
  describe("escapeHtml", () => {
    it("escapes script tags, quotes, ampersands and angle brackets", () => {
      const raw = '<script>alert("XSS & fun")</script>\'test\'';
      const escaped = escapeHtml(raw);

      expect(escaped).not.toContain("<script>");
      expect(escaped).not.toContain("</script>");
      expect(escaped).toContain("&lt;script&gt;");
      expect(escaped).toContain("&lt;/script&gt;");
      expect(escaped).toContain("&amp;");
      expect(escaped).toContain("&quot;");
      expect(escaped).toContain("&#39;");
    });

    it("ensures guest-supplied <b>x</b> never appears unescaped in generated HTML", () => {
      const data = makeTestData({
        name: "Malicious <b>name</b>",
        message: "Injecting <b>x</b> and <script>attack()</script>",
      });
      const summary = computeRequestSummary(data);
      const reference = "KZ-261030-TEST";

      const teamEmail = buildTeamEmail(summary, data, reference);
      const guestEmail = buildGuestEmail(summary, data, reference);

      // Raw tags should never appear in HTML
      expect(teamEmail.html).not.toContain("<b>name</b>");
      expect(teamEmail.html).not.toContain("<b>x</b>");
      expect(teamEmail.html).not.toContain("<script>");
      expect(teamEmail.html).toContain("&lt;b&gt;name&lt;/b&gt;");
      expect(teamEmail.html).toContain("&lt;b&gt;x&lt;/b&gt;");

      expect(guestEmail.html).not.toContain("<b>name</b>");
      expect(guestEmail.html).toContain("&lt;b&gt;name&lt;/b&gt;");
    });
  });

  describe("Team Email", () => {
    it("builds team email containing all required fields, reference, and 'not a booking' sentence", () => {
      const data = makeTestData();
      const summary = computeRequestSummary(data);
      const reference = "KZ-261030-9ABC";

      const email = buildTeamEmail(summary, data, reference);

      // Subject
      expect(email.subject).toBe(
        `New trip request ${reference}: Alice Smith, 2026-11-10 to 2026-11-15`
      );

      // Both plain text and HTML contain reference
      expect(email.text).toContain(reference);
      expect(email.html).toContain(reference);

      // Contains "not a booking" requirement
      const notABooking =
        "This is a request, not a booking. We will check availability and confirm the details and payment with you directly.";
      expect(email.text).toContain(notABooking);
      expect(email.html).toContain(notABooking);

      // Contains guest details and items
      expect(email.text).toContain("Alice Smith");
      expect(email.text).toContain("alice@example.com");
      expect(email.text).toContain("+263 71 000 0000");
      expect(email.text).toContain("vegan meals");
      expect(email.text).toContain("Reply to this email to answer the guest.");

      // Totals
      expect(email.text).toContain("Estimated Total");
      expect(email.text).toContain("Total (USD)");
      expect(email.html).toContain("Total in USD");
    });
  });

  describe("Guest Email", () => {
    it("builds guest email containing reference, site contact info, and required 'not a booking' sentence", () => {
      const data = makeTestData();
      const summary = computeRequestSummary(data);
      const reference = "KZ-261030-9ABC";

      const email = buildGuestEmail(summary, data, reference);

      // Subject
      expect(email.subject).toBe(`We received your trip request ${reference}`);

      // Contains reference
      expect(email.text).toContain(reference);
      expect(email.html).toContain(reference);

      // Exactly this required sentence
      const notABooking =
        "This is a request, not a booking. We will check availability and confirm the details and payment with you directly.";
      expect(email.text).toContain(notABooking);
      expect(email.html).toContain(notABooking);

      // Contains contact info from site.ts
      expect(email.text).toContain(site.bookingEmail);
      expect(email.text).toContain(site.whatsappNumber);
      expect(email.html).toContain(site.bookingEmail);
      expect(email.html).toContain(site.whatsappNumber);

      // Contains estimate notice
      expect(email.text).toContain("This is an estimate");
      expect(email.html).toContain("This is an estimate");
    });
  });
});

