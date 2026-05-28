"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";

export type RevealAnimation =
  | "fadeInUp"
  | "fadeInDown"
  | "fadeInLeft"
  | "fadeInRight"
  | "zoomIn"
  | "fade";

type Props = {
  children: ReactNode;
  /** Animation keyword — paired CSS lives in globals.css under `.anim-<name>`. */
  animation?: RevealAnimation;
  /** Stagger delay in ms — applied via data attribute and resolved at observe time. */
  delay?: number;
  /** Render element. Defaults to <div>. */
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  /** Optional id for scroll-link / anchor targets. */
  id?: string;
};

/**
 * Per-element animation wrapper. Adds the right starting class, plus
 * `data-animate` / `data-animate-delay` so `useScrollRevealSections`
 * observes it and toggles `.is-visible` when scrolled into view.
 *
 * Combines well with whole-section animations from `.invite-section`.
 */
export function Reveal({
  children,
  animation = "fadeInUp",
  delay = 0,
  as: Tag = "div",
  className = "",
  style,
  id,
}: Props) {
  const cls = `anim anim-${animation} ${className}`.trim();
  return (
    <Tag
      id={id}
      className={cls}
      data-animate={animation}
      data-animate-delay={delay > 0 ? delay : undefined}
      style={style}
    >
      {children}
    </Tag>
  );
}
