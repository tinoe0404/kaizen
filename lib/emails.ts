import { RequestPayload, RequestSummary } from "@/lib/request";
import { site } from "@/content/site";
import { ratesUpdated } from "@/content/currency";
import { formatCurrencyAmount } from "@/lib/pricing";

// ─── HTML Escaping ────────────────────────────────────────────────────────

/**
 * Escapes characters with special meaning in HTML to prevent XSS / HTML injection.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface EmailContent {
  subject: string;
  text: string;
  html: string;
}

// ─── Team Email ──────────────────────────────────────────────────────────

/**
 * Builds the notification email sent to the Kaizen operations / booking team.
 */
export function buildTeamEmail(
  summary: RequestSummary,
  data: RequestPayload,
  reference: string
): EmailContent {
  const subject = `New trip request ${reference}: ${data.name}, ${data.arrival} to ${data.departure}`;

  const formattedGuestTotal = formatCurrencyAmount(
    summary.totalConverted,
    summary.currency
  );
  const formattedUsdTotal = formatCurrencyAmount(summary.totalUsd, "USD");

  // Plain-text version
  const textLines: string[] = [
    `New trip request received (${reference})`,
    "",
    `Guest Name: ${data.name}`,
    `Guest Email: ${data.email}`,
    `Phone / WhatsApp: ${data.phone || "Not provided"}`,
    "",
    "Trip Dates & Details:",
    `Arrival: ${data.arrival}`,
    `Departure: ${data.departure}`,
    `Duration: ${summary.nights} ${summary.nights === 1 ? "night" : "nights"}`,
    `Group Size: ${data.guests} ${data.guests === 1 ? "guest" : "guests"}`,
    `Selected Currency: ${data.currency}`,
    "",
    "Requested Offerings:",
  ];

  for (const line of summary.lines) {
    const formattedLineAmount = formatCurrencyAmount(
      line.converted,
      summary.currency
    );
    textLines.push(`- ${line.name} (${line.breakdown}) — ${formattedLineAmount}`);
  }

  textLines.push("");
  textLines.push(`Estimated Total (${summary.currency}): ${formattedGuestTotal}`);
  textLines.push(`Total (USD): ${formattedUsdTotal}`);
  textLines.push(`Exchange rates as of: ${ratesUpdated}`);
  textLines.push("");
  textLines.push(
    "Status: This is a request, not a booking. We will check availability and confirm the details and payment with you directly."
  );
  textLines.push("");

  if (data.message) {
    textLines.push("Guest Message / Notes:");
    textLines.push(data.message);
    textLines.push("");
  }

  textLines.push("Reply to this email to answer the guest.");

  const text = textLines.join("\n");

  // HTML version
  const itemRowsHtml = summary.lines
    .map((line) => {
      const formattedAmount = formatCurrencyAmount(
        line.converted,
        summary.currency
      );
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #F2EADA;color:#0F2A1A;font-size:15px;line-height:1.4;">
            <strong>${escapeHtml(line.name)}</strong>
            <div style="font-size:13px;color:#0F2A1A;opacity:0.75;margin-top:2px;">${escapeHtml(line.breakdown)}</div>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #F2EADA;color:#0F2A1A;font-size:15px;text-align:right;white-space:nowrap;font-weight:600;">
            ${escapeHtml(formattedAmount)}
          </td>
        </tr>
      `;
    })
    .join("");

  const guestMessageHtml = data.message
    ? `
      <div style="margin-top:20px;padding:14px;background-color:#F2EADA;border-left:4px solid #1E4D2B;border-radius:4px;">
        <div style="font-size:13px;font-weight:bold;color:#1E4D2B;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Guest Message / Notes</div>
        <div style="font-size:15px;color:#0F2A1A;white-space:pre-wrap;line-height:1.5;">${escapeHtml(data.message)}</div>
      </div>
    `
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:24px;background-color:#FBF8F1;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F2A1A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background-color:#ffffff;border:1px solid #F2EADA;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="background-color:#0F2A1A;padding:24px;color:#FBF8F1;">
        <div style="font-size:13px;font-weight:bold;color:#E08A1E;letter-spacing:1px;text-transform:uppercase;">Kaizen Travel & Adventures</div>
        <h1 style="margin:6px 0 0 0;font-size:20px;line-height:1.3;color:#FBF8F1;">New Trip Request: ${escapeHtml(reference)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;width:130px;color:#0F2A1A;opacity:0.75;font-size:14px;">Guest Name:</td>
            <td style="padding:6px 0;font-weight:600;font-size:15px;color:#0F2A1A;">${escapeHtml(data.name)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#0F2A1A;opacity:0.75;font-size:14px;">Guest Email:</td>
            <td style="padding:6px 0;font-size:15px;"><a href="mailto:${escapeHtml(data.email)}" style="color:#1E4D2B;font-weight:600;text-decoration:none;">${escapeHtml(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#0F2A1A;opacity:0.75;font-size:14px;">Phone / WhatsApp:</td>
            <td style="padding:6px 0;font-size:15px;color:#0F2A1A;">${escapeHtml(data.phone || "Not provided")}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#0F2A1A;opacity:0.75;font-size:14px;">Dates:</td>
            <td style="padding:6px 0;font-size:15px;color:#0F2A1A;"><strong>${escapeHtml(data.arrival)}</strong> to <strong>${escapeHtml(data.departure)}</strong> (${summary.nights} ${summary.nights === 1 ? "night" : "nights"})</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#0F2A1A;opacity:0.75;font-size:14px;">Group Size:</td>
            <td style="padding:6px 0;font-size:15px;color:#0F2A1A;">${data.guests} ${data.guests === 1 ? "guest" : "guests"}</td>
          </tr>
        </table>

        ${guestMessageHtml}

        <h2 style="font-size:16px;color:#1E4D2B;margin:24px 0 12px 0;border-bottom:2px solid #F2EADA;padding-bottom:6px;">Requested Items</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:16px;">
          ${itemRowsHtml}
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2EADA;border-radius:6px;padding:12px;margin-top:16px;">
          <tr>
            <td style="padding:6px 12px;font-size:16px;font-weight:bold;color:#0F2A1A;">Estimated Total (${escapeHtml(summary.currency)}):</td>
            <td style="padding:6px 12px;font-size:18px;font-weight:bold;color:#E08A1E;text-align:right;">${escapeHtml(formattedGuestTotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 12px;font-size:14px;color:#0F2A1A;opacity:0.8;">Total in USD:</td>
            <td style="padding:4px 12px;font-size:14px;color:#0F2A1A;font-weight:600;text-align:right;">${escapeHtml(formattedUsdTotal)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:4px 12px;font-size:12px;color:#0F2A1A;opacity:0.6;">
              Exchange rates as of: ${escapeHtml(ratesUpdated)}
            </td>
          </tr>
        </table>

        <div style="margin-top:20px;padding:12px;background-color:#FBF8F1;border:1px solid #F2EADA;border-radius:6px;font-size:13px;color:#0F2A1A;line-height:1.4;">
          This is a request, not a booking. We will check availability and confirm the details and payment with you directly.
        </div>

        <p style="margin-top:24px;font-size:14px;color:#1E4D2B;font-weight:600;">
          Reply to this email to answer the guest.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

// ─── Guest Email ─────────────────────────────────────────────────────────

/**
 * Builds the confirmation / acknowledgement email sent to the guest.
 */
export function buildGuestEmail(
  summary: RequestSummary,
  data: RequestPayload,
  reference: string
): EmailContent {
  const subject = `We received your trip request ${reference}`;

  const formattedGuestTotal = formatCurrencyAmount(
    summary.totalConverted,
    summary.currency
  );

  // Plain-text version
  const textLines: string[] = [
    `Dear ${data.name},`,
    "",
    `Thank you for your trip request with ${site.name}.`,
    `Your request reference is: ${reference}`,
    "",
    "Trip Details:",
    `Arrival: ${data.arrival}`,
    `Departure: ${data.departure} (${summary.nights} ${summary.nights === 1 ? "night" : "nights"})`,
    `Guests: ${data.guests}`,
    "",
    "What you asked for:",
  ];

  for (const line of summary.lines) {
    const formattedLineAmount = formatCurrencyAmount(
      line.converted,
      summary.currency
    );
    textLines.push(`- ${line.name} (${line.breakdown}): ${formattedLineAmount}`);
  }

  textLines.push("");
  textLines.push(`Estimated Total: ${formattedGuestTotal}`);
  textLines.push("This is an estimate based on current rates.");
  textLines.push("");
  textLines.push(
    "This is a request, not a booking. We will check availability and confirm the details and payment with you directly."
  );
  textLines.push("");
  textLines.push("If you have questions or updates, reach out to us:");
  textLines.push(`Email: ${site.bookingEmail}`);
  textLines.push(`WhatsApp: ${site.whatsappNumber}`);
  textLines.push("");
  textLines.push(`Warm regards,\n${site.name}`);

  const text = textLines.join("\n");

  // HTML version
  const itemRowsHtml = summary.lines
    .map((line) => {
      const formattedAmount = formatCurrencyAmount(
        line.converted,
        summary.currency
      );
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #F2EADA;color:#0F2A1A;font-size:14px;">
            <strong>${escapeHtml(line.name)}</strong>
            <div style="font-size:12px;color:#0F2A1A;opacity:0.75;">${escapeHtml(line.breakdown)}</div>
          </td>
          <td style="padding:8px 12px;border-bottom:1px solid #F2EADA;color:#0F2A1A;font-size:14px;text-align:right;white-space:nowrap;font-weight:600;">
            ${escapeHtml(formattedAmount)}
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:24px;background-color:#FBF8F1;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0F2A1A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border:1px solid #F2EADA;border-radius:8px;overflow:hidden;">
    <tr>
      <td style="background-color:#1E4D2B;padding:24px;color:#FBF8F1;">
        <div style="font-size:12px;font-weight:bold;color:#E08A1E;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(site.name)}</div>
        <h1 style="margin:6px 0 0 0;font-size:20px;color:#FBF8F1;font-weight:600;">We received your trip request</h1>
        <div style="margin-top:6px;font-size:14px;color:#F2EADA;">Reference: <strong>${escapeHtml(reference)}</strong></div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <p style="margin:0 0 16px 0;font-size:16px;line-height:1.5;">Dear ${escapeHtml(data.name)},</p>
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;">
          Thank you for reaching out to plan your journey with us. We have received your trip request and our team is reviewing availability.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;background-color:#FBF8F1;border-radius:6px;padding:12px;font-size:14px;">
          <tr>
            <td style="padding:4px 8px;color:#0F2A1A;opacity:0.75;width:90px;">Dates:</td>
            <td style="padding:4px 8px;font-weight:600;color:#0F2A1A;">${escapeHtml(data.arrival)} to ${escapeHtml(data.departure)} (${summary.nights} ${summary.nights === 1 ? "night" : "nights"})</td>
          </tr>
          <tr>
            <td style="padding:4px 8px;color:#0F2A1A;opacity:0.75;">Guests:</td>
            <td style="padding:4px 8px;font-weight:600;color:#0F2A1A;">${data.guests}</td>
          </tr>
        </table>

        <h2 style="font-size:15px;color:#1E4D2B;margin:20px 0 8px 0;padding-bottom:4px;border-bottom:1px solid #F2EADA;">Requested Items</h2>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:12px;">
          ${itemRowsHtml}
        </table>

        <div style="margin:16px 0;padding:12px;background-color:#F2EADA;border-radius:6px;text-align:right;">
          <div style="font-size:13px;color:#0F2A1A;opacity:0.75;">Estimated Total (${escapeHtml(summary.currency)})</div>
          <div style="font-size:20px;font-weight:bold;color:#E08A1E;margin-top:2px;">${escapeHtml(formattedGuestTotal)}</div>
          <div style="font-size:12px;color:#0F2A1A;opacity:0.65;margin-top:4px;">This is an estimate based on current rates.</div>
        </div>

        <div style="margin:20px 0;padding:14px;background-color:#FBF8F1;border-left:4px solid #E08A1E;border-radius:4px;font-size:14px;line-height:1.5;color:#0F2A1A;">
          <strong>Important notice:</strong> This is a request, not a booking. We will check availability and confirm the details and payment with you directly.
        </div>

        <p style="margin:20px 0 8px 0;font-size:14px;line-height:1.5;color:#0F2A1A;">
          If you have any questions or would like to make changes in the meantime:
        </p>
        <ul style="margin:0 0 20px 0;padding-left:20px;font-size:14px;line-height:1.6;color:#0F2A1A;">
          <li>Email: <a href="mailto:${escapeHtml(site.bookingEmail)}" style="color:#1E4D2B;font-weight:600;">${escapeHtml(site.bookingEmail)}</a></li>
          <li>WhatsApp: <span style="font-weight:600;">${escapeHtml(site.whatsappNumber)}</span></li>
        </ul>

        <p style="margin:0;font-size:15px;line-height:1.5;color:#0F2A1A;">
          Warm regards,<br>
          <strong>${escapeHtml(site.name)}</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

