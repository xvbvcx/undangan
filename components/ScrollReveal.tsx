"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Animation variant applied when element enters viewport */
  animation?: "fade-up" | "fade-left" | "fade-right" | "fade-scale" | "slide-up" | "slide-left" | "slide-right";
  /** Delay in ms before animation triggers (stagger effect) */
  delay?: number;
  /** IntersectionObserver threshold 0-1 */
  threshold?: number;
};

/**
 * Wraps children in a container that animates into view when scrolled to.
 * Uses IntersectionObserver — no external library, zero JS bundle cost
 * when SSR'd, and respects prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className = "",
  animation = "fade-up",
  delay = 0,
  threshold = 0.15
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("sr-visible");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          // Apply delay via inline style for stagger
          if (delay > 0) {
            el.style.transitionDelay = `${delay}ms`;
            el.style.animationDelay = `${delay}ms`;
          }
          el.classList.add("sr-visible");
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={`sr-reveal sr-${animation} ${className}`}>
      {children}
    </div>
  );
}
