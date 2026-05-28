"use client";

import { useEffect, useState } from "react";

/**
 * Urgency countdown for the landing page promo banner. Counts down to
 * end-of-day in user's local timezone and resets every midnight.
 *
 * Renders a horizontal pill with H/M/S slots. Pure-CSS hide on very
 * narrow viewports if needed.
 */
function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    h: Math.floor(ms / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
  };
}

function endOfToday() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function UrgencyCountdown({ label = "Promo gratis berakhir dalam" }: { label?: string }) {
  const [target, setTarget] = useState(() => endOfToday());
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      if (now >= target) {
        const next = endOfToday();
        setTarget(next);
        setT(diff(next));
      } else {
        setT(diff(target));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div className="urgency-bar" role="status" aria-live="polite">
      <span className="urgency-icon" aria-hidden>⏳</span>
      <span className="urgency-label">{label}</span>
      <span className="urgency-clock">
        <span><strong>{String(t.h).padStart(2, "0")}</strong><small>jam</small></span>
        <span><strong>{String(t.m).padStart(2, "0")}</strong><small>menit</small></span>
        <span><strong>{String(t.s).padStart(2, "0")}</strong><small>detik</small></span>
      </span>
    </div>
  );
}
