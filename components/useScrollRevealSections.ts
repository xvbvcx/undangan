"use client";

import { useEffect } from "react";

/**
 * Scroll reveal observer for invitation pages.
 *
 * Observes three groups of elements:
 *   1. `.invite-section` — adds `.section-visible` (whole-section reveal).
 *   2. `.invite-gallery` — adds `.gallery-visible` (staggers tile children).
 *   3. `[data-animate]` — adds `.is-visible` and reads the value
 *      ("zoomIn" | "fadeInUp" | "fadeInDown" | "fadeInLeft" | …) to drive a
 *      per-element entrance animation defined in globals.css.
 *
 * Honours `prefers-reduced-motion` by immediately marking everything
 * visible without observing.
 */
export function useScrollRevealSections() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document
        .querySelectorAll(".invite-section, .invite-gallery, [data-animate]")
        .forEach((el) => {
          el.classList.add("section-visible", "gallery-visible", "is-visible");
        });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.classList.contains("invite-section")) {
            el.classList.add("section-visible");
          }
          if (el.classList.contains("invite-gallery")) {
            el.classList.add("gallery-visible");
          }
          if (el.dataset.animate) {
            // Stagger via data-animate-delay (ms).
            const delay = Number(el.dataset.animateDelay || "0");
            if (delay > 0) {
              el.style.animationDelay = `${delay}ms`;
              el.style.transitionDelay = `${delay}ms`;
            }
            el.classList.add("is-visible");
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    // Render-after-mount delay so layouts have their nodes in place
    // before we start observing.
    const timer = setTimeout(() => {
      document
        .querySelectorAll(".invite-section, .invite-gallery, [data-animate]")
        .forEach((el) => observer.observe(el));
    }, 80);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
