import { ImageResponse } from "next/og";

// Placeholder until client supplies proper favicon
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: "6px",
          position: "relative",
        }}
      >
        <span
          style={{
            fontFamily: "sans-serif",
            fontWeight: 700,
            fontSize: 22,
            color: "#FBF8F1",
            lineHeight: 1,
          }}
        >
          K
        </span>
        <div
          style={{
            position: "absolute",
            bottom: 2,
            right: 2,
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: "#E08A1E",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

