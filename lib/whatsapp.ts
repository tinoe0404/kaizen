import { site } from "@/content/site";

/**
 * Builds a direct WhatsApp click-to-chat URL using the digits from site.whatsappNumber.
 * Returns "#" if the phone number is missing, empty, or still a placeholder.
 */
export function whatsappLink(text?: string): string {
  if (!site.whatsappNumber || site.whatsappNumber.includes("[")) {
    return "#";
  }

  const digits = site.whatsappNumber.replace(/\D/g, "");
  if (!digits) {
    return "#";
  }

  if (text) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }

  return `https://wa.me/${digits}`;
}

