// Cultural ornament SVGs for the 5 adat templates.
// Each ornament is inspired by the traditional motifs of its culture.

import type { TemplateCulture } from "@/lib/types";

type Props = { className?: string; size?: number };

// Jawa: Batik kawung pattern (4-petal circular motif)
export function JawaBatikOrnament({ className = "", size = 160 }: Props) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {/* Central kawung */}
        <circle cx="100" cy="100" r="18" />
        <ellipse cx="100" cy="72" rx="10" ry="16" />
        <ellipse cx="100" cy="128" rx="10" ry="16" />
        <ellipse cx="72" cy="100" rx="16" ry="10" />
        <ellipse cx="128" cy="100" rx="16" ry="10" />
        {/* Corner kawung smaller */}
        <circle cx="40" cy="40" r="10" opacity=".5" />
        <ellipse cx="40" cy="28" rx="5" ry="9" opacity=".5" />
        <ellipse cx="40" cy="52" rx="5" ry="9" opacity=".5" />
        <ellipse cx="28" cy="40" rx="9" ry="5" opacity=".5" />
        <ellipse cx="52" cy="40" rx="9" ry="5" opacity=".5" />
        <circle cx="160" cy="160" r="10" opacity=".5" />
        <ellipse cx="160" cy="148" rx="5" ry="9" opacity=".5" />
        <ellipse cx="160" cy="172" rx="5" ry="9" opacity=".5" />
        <ellipse cx="148" cy="160" rx="9" ry="5" opacity=".5" />
        <ellipse cx="172" cy="160" rx="9" ry="5" opacity=".5" />
        {/* Connecting lines */}
        <path d="M60 60 L82 82" opacity=".4" />
        <path d="M140 140 L118 118" opacity=".4" />
        <circle cx="100" cy="100" r="4" fill="currentColor" opacity=".6" />
      </g>
    </svg>
  );
}


// Aceh: Pintoe Aceh (multi-layered arch motif)
export function AcehArchOrnament({ className = "", size = 160 }: Props) {
  return (
    <svg viewBox="0 0 200 280" width={size} height={size * 1.4} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {/* Outer arch */}
        <path d="M30 260 V 120 a 70 70 0 0 1 140 0 V 260" />
        {/* Inner arch */}
        <path d="M50 260 V 130 a 50 50 0 0 1 100 0 V 260" opacity=".75" />
        {/* Innermost arch */}
        <path d="M70 260 V 140 a 30 30 0 0 1 60 0 V 260" opacity=".55" />
        {/* Top finial */}
        <circle cx="100" cy="48" r="8" fill="currentColor" opacity=".5" />
        <path d="M92 48 L100 30 L108 48" fill="none" />
        <path d="M85 56 Q100 20 115 56" opacity=".6" />
        {/* Side florals */}
        <circle cx="30" cy="180" r="6" fill="currentColor" opacity=".35" />
        <circle cx="170" cy="180" r="6" fill="currentColor" opacity=".35" />
        <path d="M24 174 Q30 164 36 174" opacity=".5" />
        <path d="M164 174 Q170 164 176 174" opacity=".5" />
        {/* Base line */}
        <line x1="20" y1="260" x2="180" y2="260" strokeWidth="2" />
      </g>
    </svg>
  );
}

// Batak: Gorga pattern (geometric triangular + spiral motifs)
export function BatakGorgaOrnament({ className = "", size = 160 }: Props) {
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        {/* Central diamond */}
        <path d="M100 30 L170 100 L100 170 L30 100 Z" />
        <path d="M100 50 L150 100 L100 150 L50 100 Z" opacity=".7" />
        {/* Gorga spirals at corners */}
        <path d="M100 30 Q115 15 130 30 Q115 45 100 30" fill="currentColor" opacity=".4" />
        <path d="M170 100 Q185 115 170 130 Q155 115 170 100" fill="currentColor" opacity=".4" />
        <path d="M100 170 Q85 185 70 170 Q85 155 100 170" fill="currentColor" opacity=".4" />
        <path d="M30 100 Q15 85 30 70 Q45 85 30 100" fill="currentColor" opacity=".4" />
        {/* Triangular teeth (ulos pattern) */}
        <path d="M60 60 L80 40 L80 60 Z" fill="currentColor" opacity=".3" />
        <path d="M140 60 L120 40 L120 60 Z" fill="currentColor" opacity=".3" />
        <path d="M60 140 L80 160 L80 140 Z" fill="currentColor" opacity=".3" />
        <path d="M140 140 L120 160 L120 140 Z" fill="currentColor" opacity=".3" />
        {/* Center */}
        <circle cx="100" cy="100" r="12" />
        <circle cx="100" cy="100" r="5" fill="currentColor" opacity=".5" />
      </g>
    </svg>
  );
}


// Minang: Rumah Gadang roof silhouette + ukiran
export function MinangRumahGadangOrnament({ className = "", size = 180 }: Props) {
  return (
    <svg viewBox="0 0 240 180" width={size} height={size * 0.75} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {/* Rumah Gadang roof — curved horn shape (gonjong) */}
        <path d="M40 140 Q60 60 80 80 Q100 40 120 80 Q140 40 160 80 Q180 60 200 140" />
        {/* Inner roof lines */}
        <path d="M60 130 Q80 80 100 90 Q120 60 140 90 Q160 80 180 130" opacity=".65" />
        {/* Vertical pillars */}
        <line x1="60" y1="130" x2="60" y2="170" />
        <line x1="120" y1="100" x2="120" y2="170" />
        <line x1="180" y1="130" x2="180" y2="170" />
        {/* Base */}
        <line x1="40" y1="170" x2="200" y2="170" strokeWidth="2" />
        {/* Decorative ukiran */}
        <path d="M85 120 Q95 110 105 120 Q115 130 125 120" opacity=".6" />
        <path d="M135 120 Q145 110 155 120" opacity=".6" />
        <circle cx="120" cy="130" r="4" fill="currentColor" opacity=".45" />
        {/* Gonjong tips */}
        <circle cx="40" cy="140" r="3" fill="currentColor" opacity=".5" />
        <circle cx="200" cy="140" r="3" fill="currentColor" opacity=".5" />
      </g>
    </svg>
  );
}

// Lampung: Siger crown (traditional bridal crown)
export function LampungSigerOrnament({ className = "", size = 180 }: Props) {
  return (
    <svg viewBox="0 0 240 160" width={size} height={size * 0.67} className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        {/* Crown base arc */}
        <path d="M30 130 Q120 90 210 130" strokeWidth="2" />
        {/* 9 pointed crown peaks (siger has 9 points) */}
        <path d="M50 120 L55 80 L60 120" />
        <path d="M70 115 L77 70 L84 115" />
        <path d="M90 110 L100 55 L110 110" />
        <path d="M115 105 L120 40 L125 105" />
        <path d="M130 110 L140 55 L150 110" />
        <path d="M156 115 L163 70 L170 115" />
        <path d="M180 120 L185 80 L190 120" />
        {/* Central tallest peak decoration */}
        <circle cx="120" cy="35" r="5" fill="currentColor" opacity=".5" />
        <path d="M115 35 L120 22 L125 35" fill="none" />
        {/* Crown jewels on peaks */}
        <circle cx="55" cy="78" r="3" fill="currentColor" opacity=".4" />
        <circle cx="77" cy="68" r="3" fill="currentColor" opacity=".4" />
        <circle cx="100" cy="53" r="3" fill="currentColor" opacity=".4" />
        <circle cx="140" cy="53" r="3" fill="currentColor" opacity=".4" />
        <circle cx="163" cy="68" r="3" fill="currentColor" opacity=".4" />
        <circle cx="185" cy="78" r="3" fill="currentColor" opacity=".4" />
        {/* Base decorative band */}
        <path d="M30 135 Q120 110 210 135" opacity=".5" />
        <line x1="20" y1="145" x2="220" y2="145" strokeWidth="1" opacity=".4" />
      </g>
    </svg>
  );
}

// Dispatcher
export function AdatOrnament({ culture, className, size }: { culture: TemplateCulture; className?: string; size?: number }) {
  switch (culture) {
    case "jawa":    return <JawaBatikOrnament className={className} size={size} />;
    case "aceh":    return <AcehArchOrnament className={className} size={size} />;
    case "batak":   return <BatakGorgaOrnament className={className} size={size} />;
    case "minang":  return <MinangRumahGadangOrnament className={className} size={size} />;
    case "lampung": return <LampungSigerOrnament className={className} size={size} />;
    default:        return <JawaBatikOrnament className={className} size={size} />;
  }
}
