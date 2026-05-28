"use client";

import { useEffect } from "react";

/**
 * Observes all `.invite-section` and `.invite-gallery` elements within a
 * container and adds `.section-visible` / `.gallery-visible` when they
 * enter the viewport. Call this once in the top-level invitation renderer.
 */
export function useScrollRevealSections() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Immediately show everything
      document.querySelectorAll(".invite-section, .invite-gallery").forEach((el) => {
        el.classList.add("section-visible", "gallery-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target;
            if (el.classList.contains("invite-section")) {
              el.classList.add("section-visible");
            }
            if (el.classList.contains("invite-gallery")) {
              el.classList.add("gallery-visible");
            }
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    // Small delay to let the DOM render after gate opens
    const timer = setTimeout(() => {
      document.querySelectorAll(".invite-section, .invite-gallery").forEach((el) => {
        observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);
}
