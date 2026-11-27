import { describe, it, expect, vi, afterEach } from "vitest";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("no-ops cleanly on the server when window is undefined", () => {
    expect(() => trackEvent("whatsapp_click", { source: "ssr" })).not.toThrow();
  });

  it("dispatches a CustomEvent on window with event name and payload", () => {
    const dispatchEvent = vi.fn();
    vi.stubGlobal("window", { dispatchEvent });
    vi.stubGlobal(
      "CustomEvent",
      class {
        type: string;
        detail: unknown;
        constructor(type: string, init?: { detail?: unknown }) {
          this.type = type;
          this.detail = init?.detail;
        }
      }
    );

    trackEvent("whatsapp_click", { source: "footer" });

    expect(dispatchEvent).toHaveBeenCalledTimes(1);
    const evt = dispatchEvent.mock.calls[0][0] as { type: string; detail: unknown };
    expect(evt.type).toBe("kaizen:track");
    expect(evt.detail).toEqual({
      event: "whatsapp_click",
      source: "footer",
    });
  });

  it("pushes to window.dataLayer when present without throwing", () => {
    const dataLayer: unknown[] = [];
    vi.stubGlobal("window", {
      dispatchEvent: vi.fn(),
      dataLayer,
    });

    trackEvent("package_add_to_trip", { slug: "vic-falls-chobe-combo" });

    expect(dataLayer).toEqual([
      {
        event: "package_add_to_trip",
        slug: "vic-falls-chobe-combo",
      },
    ]);
  });
});
