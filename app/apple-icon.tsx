import { ImageResponse } from "next/og";

// Placeholder until client supplies proper favicon
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1E4D2B",
          borderRadius: "36px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 120,
            color: "#FBF8F1",
            lineHeight: 1,
          }}
        >
          K
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#E08A1E",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

