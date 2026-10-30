import { describe, it, expect } from "vitest";
import { whatsappLink } from "./whatsapp";

describe("whatsappLink", () => {
  it("returns '#' when whatsappNumber is a bracketed placeholder", () => {
    // Current site.whatsappNumber is "[WhatsApp number]"
    expect(whatsappLink()).toBe("#");
    expect(whatsappLink("Hello")).toBe("#");
  });
});

