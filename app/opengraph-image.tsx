import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kaizen Travel and Adventures";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1E4D2B",
          position: "relative",
        }}
      >
        {/* Sun accent bar at the top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: "#E08A1E",
          }}
        />

        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 64,
            color: "#FBF8F1",
            lineHeight: 1.2,
          }}
        >
          Kaizen Travel
        </span>
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 64,
            color: "#FBF8F1",
            lineHeight: 1.2,
          }}
        >
          and Adventures
        </span>
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 400,
            fontSize: 28,
            color: "#FBF8F1",
            opacity: 0.85,
            marginTop: 24,
          }}
        >
          Build your trip. Send one request.
        </span>
      </div>
    ),
    { ...size }
  );
}

