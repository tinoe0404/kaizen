"use client";

import React from "react";
import { site } from "@/content/site";
import { normalizeWhatsappNumber } from "@/lib/whatsapp";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isWhatsAppValid = normalizeWhatsappNumber(site.whatsappNumber) !== null;

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: "48px 16px",
          backgroundColor: "#FBF8F1",
          color: "#0F2A1A",
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
            textAlign: "center",
            padding: "32px 24px",
            borderRadius: "14px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #F2EADA",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#E08A1E",
            }}
          >
            ERROR
          </span>
          <h1
            style={{
              margin: "12px 0",
              fontSize: "28px",
              fontWeight: 700,
              color: "#0F2A1A",
              lineHeight: 1.25,
            }}
          >
            Something went wrong on our side.
          </h1>
          <p
            style={{
              margin: "0 0 24px 0",
              fontSize: "16px",
              color: "#0F2A1A",
              opacity: 0.8,
              lineHeight: 1.5,
            }}
          >
            We are sorry for the disruption. You can try refreshing the page, or
            contact our team directly if you need assistance with your trip.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                backgroundColor: "#E08A1E",
                color: "#0F2A1A",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: "pointer",
                minHeight: "44px",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                backgroundColor: "transparent",
                color: "#0F2A1A",
                border: "1px solid #0F2A1A",
                borderRadius: "8px",
                padding: "12px 24px",
                fontSize: "15px",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                minHeight: "44px",
              }}
            >
              Back to home
            </a>
          </div>

          <div
            style={{
              paddingTop: "24px",
              borderTop: "1px solid #F2EADA",
              fontSize: "14px",
            }}
          >
            <p style={{ margin: "0 0 8px 0", fontWeight: 600, color: "#0F2A1A" }}>
              Reach out to our team:
            </p>
            <div
              style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {isWhatsAppValid && (
                <a
                  href={`https://wa.me/${normalizeWhatsappNumber(site.whatsappNumber)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#1E4D2B",
                    fontWeight: 600,
                    textDecoration: "underline",
                  }}
                >
                  WhatsApp: {site.whatsappNumber}
                </a>
              )}
              <a
                href={`mailto:${site.bookingEmail}`}
                style={{
                  color: "#1E4D2B",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Email: {site.bookingEmail}
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

