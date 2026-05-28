"use client";

import Link from "next/link";

/**
 * Floating WhatsApp button + sticky mobile CTA bar.
 *
 * Mounted globally on the landing page; pure-CSS hides the mobile CTA
 * above the breakpoint and pure-CSS hides the WA button below very
 * small viewports if it overlaps.
 */
export function FloatingActions({
  whatsappNumber = "6281234567890",
  whatsappMessage = "Halo, saya tertarik dengan undangan digital Nikah Kilat",
}: {
  whatsappNumber?: string;
  whatsappMessage?: string;
}) {
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  return (
    <>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-wa"
        aria-label="Hubungi via WhatsApp"
      >
        <span className="floating-wa-icon" aria-hidden>
          <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden>
            <path d="M16 3C9 3 3.5 8.5 3.5 15.5c0 2.5.7 4.9 2 7L3 29l6.7-2.3c2 1.1 4.3 1.7 6.6 1.7h.1c7 0 12.5-5.5 12.5-12.5S23 3 16 3zm0 22.7h-.1c-2 0-3.9-.5-5.6-1.6l-.4-.2-4 1.4 1.4-3.9-.3-.4c-1.2-1.8-1.8-4-1.8-6.2 0-5.7 4.7-10.4 10.4-10.4 2.8 0 5.4 1.1 7.4 3 2 2 3 4.6 3 7.4 0 5.7-4.7 10.4-10.4 10.4zm5.7-7.8c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.8-.9-3-1.6-4.1-3.6-.3-.5.3-.5.9-1.6.1-.2.1-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.7 1.2 2.9.1.2 2 3 4.8 4.2 1.7.7 2.3.8 3.1.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.6-.4z" />
          </svg>
        </span>
        <span className="floating-wa-label">WhatsApp</span>
      </a>

      <div className="sticky-mobile-cta" aria-label="Quick action">
        <div className="sticky-mobile-meta">
          <strong>Gratis tanpa watermark</strong>
          <span>75+ template, semua premium.</span>
        </div>
        <Link href="/register" className="button gold">Mulai sekarang</Link>
      </div>
    </>
  );
}
