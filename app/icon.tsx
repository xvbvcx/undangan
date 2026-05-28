import { ImageResponse } from "next/og";

// Auto-generated favicon. Next picks this up at build time and serves it as
// /icon (with multiple sizes) so we don't need a static favicon.ico.
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: "linear-gradient(135deg, #d9b56d 0%, #fff1bd 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#1f1408",
          fontWeight: 900,
          letterSpacing: -1,
          borderRadius: 8
        }}
      >
        NK
      </div>
    ),
    { ...size }
  );
}
