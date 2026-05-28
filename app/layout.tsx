import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nikah Kilat — Undangan Digital Ultra Eksklusif",
  description: "Platform undangan pernikahan online dengan 20 template gratis dan 20 template premium ultra exclusive."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
