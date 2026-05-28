import { ImageResponse } from "next/og";

export const alt = "Nikah Kilat — Undangan Digital Ultra Eksklusif";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
          background:
            "radial-gradient(circle at 30% 20%, rgba(217,181,109,0.5), transparent 50%), radial-gradient(circle at 80% 80%, rgba(217,181,109,0.3), transparent 50%)",
          backgroundColor: "#080705",
          color: "#fff8ec",
          padding: 60
        }}
      >
        <div style={{ fontSize: 36, color: "#f4db9d", letterSpacing: 14, textTransform: "uppercase", marginBottom: 24 }}>
          Nikah Kilat
        </div>
        <div style={{ fontSize: 96, fontFamily: "Georgia, serif", color: "#fff1bd", letterSpacing: -3, textAlign: "center", lineHeight: 1 }}>
          Undangan Digital
        </div>
        <div style={{ fontSize: 96, fontFamily: "Georgia, serif", color: "#fff1bd", letterSpacing: -3, textAlign: "center", lineHeight: 1.05, marginTop: 12 }}>
          Ultra Eksklusif
        </div>
        <div style={{ fontSize: 28, color: "rgba(255,248,236,.7)", marginTop: 36 }}>
          40 template gratis & premium · publish 5 menit
        </div>
      </div>
    ),
    { ...size }
  );
}
