export type AnalyticsEventName =
  | "whatsapp_click"
  | "trip_item_toggle"
  | "package_add_to_trip"
  | "trip_request_submit";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

/**
 * Privacy-conscious, zero-dependency conversion event helper.
 * Emits a `kaizen:track` CustomEvent on `window` and forwards to `dataLayer`
 * only if already initialized on the host page. Never stores or transmits PII.
 */
export function trackEvent(
  event: AnalyticsEventName,
  payload: AnalyticsPayload = {}
): void {
  if (typeof window === "undefined") {
    return;
  }

  const detail = { event, ...payload };

  try {
    window.dispatchEvent(new CustomEvent("kaizen:track", { detail }));
  } catch {
    // Ignore environments where CustomEvent dispatch is restricted
  }

  const win = window as unknown as {
    dataLayer?: Array<Record<string, unknown>>;
    va?: (action: string, name: string, data?: Record<string, unknown>) => void;
  };

  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push(detail);
  }

  if (typeof win.va === "function") {
    win.va("event", event, payload);
  }
}
