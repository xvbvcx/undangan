// SVG ornament library for invitation layouts. Each ornament is a single
// stateless inline SVG so it scales cleanly and can be themed via the
// `currentColor` of its container.

import type { TemplateOrnament } from "@/lib/types";

type OrnamentProps = { className?: string; size?: number };

export function RoseCornerOrnament({ className = "", size = 140 }: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d={`M30 170 C 30 ${110 - i * 18}, ${60 + i * 20} ${50 + i * 6}, ${100 + i * 12} ${40 + i * 6}`}
            opacity={0.85 - i * 0.12}
          />
        ))}
        <circle cx="60" cy="120" r="8" fill="currentColor" opacity=".55" />
        <circle cx="60" cy="120" r="3" fill="#fff" opacity=".7" />
        <circle cx="120" cy="60" r="6" fill="currentColor" opacity=".5" />
        <circle cx="92" cy="92" r="4" fill="currentColor" opacity=".4" />
        <path d="M48 138 q-10 -20 -2 -38" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6" />
        <path d="M76 96 q-22 -8 -32 -28" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6" />
        <path d="M132 70 q4 -22 24 -28" stroke="currentColor" strokeWidth="1" fill="none" opacity=".6" />
      </g>
    </svg>
  );
}

export function LeafOrnament({ className = "", size = 140 }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round">
        <path d="M20 180 C 60 130, 100 90, 180 30" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} transform={`translate(${30 + i * 24} ${168 - i * 24}) rotate(${30 - i * 8})`}>
            <ellipse cx="0" cy="0" rx="14" ry="6" fill="currentColor" opacity={0.55 - i * 0.05} />
            <line x1="-14" y1="0" x2="14" y2="0" stroke="currentColor" strokeWidth=".6" opacity=".7" />
          </g>
        ))}
        <path d="M30 170 q40 -30 80 -50" opacity=".4" />
      </g>
    </svg>
  );
}

export function DecoFrameOrnament({ className = "", size = 220 }: OrnamentProps) {
  return (
    <svg viewBox="0 0 240 240" width={size} height={size} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <path d="M40 12 L 200 12" />
        <path d="M120 8 L 120 36" />
        <path d="M105 28 Q 120 8 135 28" />
        <path d="M70 32 Q 120 -8 170 32" opacity=".7" />
        <circle cx="120" cy="22" r="3" fill="currentColor" />
        <path d="M40 32 L 24 16 L 8 32" opacity=".7" />
        <path d="M200 32 L 216 16 L 232 32" opacity=".7" />
        <path d="M40 60 Q 120 100 200 60" opacity=".5" />
      </g>
    </svg>
  );
}

export function GeometricOrnament({ className = "", size = 60 }: OrnamentProps) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <line x1="0" y1="50" x2="100" y2="50" strokeOpacity=".7" />
        <circle cx="50" cy="50" r="14" />
        <circle cx="50" cy="50" r="4" fill="currentColor" />
        <line x1="36" y1="50" x2="20" y2="50" />
        <line x1="64" y1="50" x2="80" y2="50" />
      </g>
    </svg>
  );
}

export function ArchFrameOrnament({ className = "", size = 320 }: OrnamentProps) {
  return (
    <svg viewBox="0 0 320 460" width={size} height={size * 1.43} className={className} aria-hidden preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="archGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <path
        d="M30 440 V 200 a 130 130 0 0 1 260 0 V 440 Z"
        fill="none"
        stroke="url(#archGrad)"
        strokeWidth="1.6"
      />
      <path
        d="M50 440 V 210 a 110 110 0 0 1 220 0 V 440"
        fill="none"
        stroke="currentColor"
        strokeOpacity=".4"
        strokeWidth="1"
      />
      <line x1="100" y1="120" x2="220" y2="120" stroke="currentColor" strokeOpacity=".5" />
      <circle cx="160" cy="120" r="3" fill="currentColor" />
    </svg>
  );
}

export function StarsOrnament({ className = "", size = 120 }: OrnamentProps) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <g fill="currentColor">
        {[
          [40, 30, 6], [80, 70, 3], [140, 40, 4], [60, 130, 4], [110, 160, 5], [170, 110, 3], [30, 170, 3], [150, 140, 2]
        ].map(([cx, cy, r], idx) => (
          <circle key={idx} cx={cx} cy={cy} r={r} opacity={0.45 + (idx % 3) * 0.18} />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth=".7" opacity=".4">
        <line x1="40" y1="30" x2="80" y2="70" />
        <line x1="80" y1="70" x2="140" y2="40" />
        <line x1="60" y1="130" x2="110" y2="160" />
      </g>
    </svg>
  );
}

export function WaveOrnament({ className = "", size = 160 }: OrnamentProps) {
  return (
    <svg viewBox="0 0 240 60" width={size} height={size * 0.25} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <path d="M0 30 Q 30 0, 60 30 T 120 30 T 180 30 T 240 30" />
        <path d="M0 38 Q 30 8, 60 38 T 120 38 T 180 38 T 240 38" opacity=".55" />
        <path d="M0 22 Q 30 -8, 60 22 T 120 22 T 180 22 T 240 22" opacity=".55" />
      </g>
    </svg>
  );
}

export function Ornament({ kind, className, size }: { kind: TemplateOrnament; className?: string; size?: number }) {
  switch (kind) {
    case "rose":       return <RoseCornerOrnament className={className} size={size} />;
    case "leaves":     return <LeafOrnament className={className} size={size} />;
    case "deco-frame": return <DecoFrameOrnament className={className} size={size} />;
    case "geometric":  return <GeometricOrnament className={className} size={size} />;
    case "arch-frame": return <ArchFrameOrnament className={className} size={size} />;
    case "stars":      return <StarsOrnament className={className} size={size} />;
    case "wave":       return <WaveOrnament className={className} size={size} />;
    default:           return <GeometricOrnament className={className} size={size} />;
  }
}

// Decorative divider used between sections — accepts the template's ornament
// kind so dividers feel native to each layout.
export function Divider({ kind, className }: { kind: TemplateOrnament; className?: string }) {
  if (kind === "wave") return <WaveOrnament className={className} size={120} />;
  return (
    <span className={`section-divider ${className ?? ""}`} aria-hidden>
      <span />
      <Ornament kind={kind === "rose" ? "rose" : kind === "leaves" ? "leaves" : "geometric"} size={36} />
      <span />
    </span>
  );
}
