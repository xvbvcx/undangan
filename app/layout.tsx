import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/Toast";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikahkilat.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nikah Kilat — Undangan Digital Ultra Eksklusif",
    template: "%s — Nikah Kilat"
  },
  description:
    "Platform undangan pernikahan online dengan 20 template gratis dan 20 template premium ultra exclusive. Edit, publish, dan share dalam hitungan menit.",
  openGraph: {
    type: "website",
    siteName: "Nikah Kilat",
    locale: "id_ID"
  },
  twitter: {
    card: "summary_large_image"
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: "#080705",
  colorScheme: "dark"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
