import { describe, it, expect } from "vitest";
import { site } from "@/content/site";
import { about } from "@/content/about";
import { privacy, privacyLastUpdated } from "@/content/privacy";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

describe("Company Pages & Content Logic", () => {
  describe("site.ts extensions", () => {
    it("contains hours, address, bookingEmail, whatsappNumber", () => {
      expect(site.hours).toBeDefined();
      expect(typeof site.hours).toBe("string");
      expect(site.address).toBeDefined();
      expect(site.bookingEmail).toBeDefined();
      expect(site.whatsappNumber).toBeDefined();
      expect(site.contactIntro).toBeDefined();
      expect(Array.isArray(site.socialLinks)).toBe(true);
    });

    it("normalizes placeholder whatsappNumber to null so WhatsApp elements are hidden", () => {
      expect(normalizeWhatsappNumber("[WhatsApp number]")).toBeNull();
    });

    it("normalizes site.whatsappNumber correctly to international format", () => {
      expect(normalizeWhatsappNumber(site.whatsappNumber)).toBe("263772123456");
    });

    it("when whatsappNumber is valid, normalizes correctly", () => {
      const validTestNumber = "+263 77 123 4567";
      expect(normalizeWhatsappNumber(validTestNumber)).toBe("263771234567");
    });
  });

  describe("about.ts", () => {
    it("has valid structured content with heading, intro, and sections", () => {
      expect(about.heading).toBeDefined();
      expect(about.intro).toBeDefined();
      expect(Array.isArray(about.sections)).toBe(true);
      expect(about.sections.length).toBeGreaterThan(0);

      for (const section of about.sections) {
        expect(section.title).toBeDefined();
        expect(Array.isArray(section.paragraphs)).toBe(true);
        expect(section.paragraphs.length).toBeGreaterThan(0);
      }
    });

    it("has optional values and photos arrays", () => {
      if (about.values) {
        expect(Array.isArray(about.values)).toBe(true);
        for (const val of about.values) {
          expect(val.title).toBeDefined();
          expect(val.text).toBeDefined();
        }
      }

      if (about.photos) {
        expect(Array.isArray(about.photos)).toBe(true);
        for (const photo of about.photos) {
          expect(photo.alt).toBeDefined();
        }
      }
    });
  });

  describe("privacy.ts", () => {
    it("has valid structured privacy content and lastUpdated constant", () => {
      expect(privacy.title).toBeDefined();
      expect(privacy.intro).toBeDefined();
      expect(privacy.lastUpdated).toBe(privacyLastUpdated);
      expect(Array.isArray(privacy.sections)).toBe(true);
      expect(privacy.sections.length).toBeGreaterThan(0);
    });

    it("covers all required topics in plain English", () => {
      const sectionTitles = privacy.sections.map((s) => s.title.toLowerCase());
      const allText = privacy.sections
        .flatMap((s) => s.paragraphs)
        .join(" ")
        .toLowerCase();

      // What we collect
      expect(sectionTitles.some((t) => t.includes("collect"))).toBe(true);
      expect(allText).toContain("name");
      expect(allText).toContain("email");

      // Why we collect it
      expect(sectionTitles.some((t) => t.includes("why"))).toBe(true);

      // Who handles it (email provider)
      expect(sectionTitles.some((t) => t.includes("who handles"))).toBe(true);
      expect(allText).toContain("smtp");

      // What stays on device (local storage, no cookies, no analytics)
      expect(sectionTitles.some((t) => t.includes("device") || t.includes("browser"))).toBe(true);
      expect(allText).toContain("local storage");
      expect(allText).toContain("no cookies");
      expect(allText).toContain("no analytics");

      // How long we keep emails
      expect(sectionTitles.some((t) => t.includes("how long"))).toBe(true);
      expect(allText).toContain("12 months");

      // Guest requests / rights
      expect(sectionTitles.some((t) => t.includes("rights") || t.includes("requests"))).toBe(true);
      expect(allText).toContain(site.bookingEmail.toLowerCase());
    });
  });
});

