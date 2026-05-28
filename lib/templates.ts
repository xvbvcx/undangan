import type { TemplateMeta, TemplateLayout, TemplateFontFamily, TemplateCoverStyle, TemplateOrnament, TemplateCulture, TemplateAnimation } from "@/lib/types";

type TemplateConfig = {
  name: string;
  category: string;
  palette: string;
  mood: string;
  layout: TemplateLayout;
  fontFamily: TemplateFontFamily;
  coverStyle: TemplateCoverStyle;
  ornament: TemplateOrnament;
  accent: string;
  animation?: TemplateAnimation;
  culture?: TemplateCulture;
};

const FEATURES = [
  "Ultra responsive", "Scroll reveal animations", "Cinematic transitions",
  "No watermark", "RSVP & Guestbook", "Galeri 8 foto", "Countdown realtime",
  "Share QR & WhatsApp", "Kepada Yth tamu", "View counter"
];

const DESCRIPTION = "Template ultra premium exclusive — gratis tanpa batas. Animasi scroll reveal, tipografi mewah, layout sinematik.";


// =========================================================
// CLASSIC (10 templates)
// =========================================================
const classicTemplates: TemplateConfig[] = [
  { name: "Seruni Classic", category: "Classic Romantic", palette: "blush", mood: "romantis", layout: "classic", fontFamily: "playfair", coverStyle: "arch", ornament: "rose", accent: "#c78383" },
  { name: "Dahayu Cream", category: "Classic Elegant", palette: "cream", mood: "elegan", layout: "classic", fontFamily: "cormorant", coverStyle: "ornament", ornament: "deco-frame", accent: "#c8a36a" },
  { name: "Cendana Warm", category: "Classic Warm", palette: "terracotta", mood: "hangat", layout: "classic", fontFamily: "cormorant", coverStyle: "ornament", ornament: "deco-frame", accent: "#d39062" },
  { name: "Melati Breeze", category: "Classic Floral", palette: "cream", mood: "lembut", layout: "classic", fontFamily: "dancing", coverStyle: "arch", ornament: "rose", accent: "#cb9c64" },
  { name: "Rona Peach", category: "Classic Sweet", palette: "peach", mood: "manis", layout: "classic", fontFamily: "playfair", coverStyle: "ornament", ornament: "rose", accent: "#e89a72" },
  { name: "Puspa Ivory", category: "Classic Pure", palette: "pearl", mood: "suci", layout: "classic", fontFamily: "italiana", coverStyle: "arch", ornament: "geometric", accent: "#f3e6c9" },
  { name: "Ratna Gold", category: "Classic Luxe", palette: "ivory-gold", mood: "mewah", layout: "classic", fontFamily: "cinzel", coverStyle: "ornament", ornament: "deco-frame", accent: "#d7b46a" },
  { name: "Kenanga Dusk", category: "Classic Dusk", palette: "burgundy", mood: "dramatis", layout: "classic", fontFamily: "playfair", coverStyle: "ornament", ornament: "rose", accent: "#d36b78" },
  { name: "Anggrek Mauve", category: "Classic Mauve", palette: "rose", mood: "anggun", layout: "classic", fontFamily: "cormorant", coverStyle: "arch", ornament: "rose", accent: "#b87da8" },
  { name: "Dahlia Rust", category: "Classic Autumn", palette: "terracotta", mood: "hangat", layout: "classic", fontFamily: "bodoni", coverStyle: "ornament", ornament: "leaves", accent: "#c4784a" },
];


// =========================================================
// FLORAL (10 templates)
// =========================================================
const floralTemplates: TemplateConfig[] = [
  { name: "Ayu Minimalis", category: "Floral Soft", palette: "blush", mood: "romantis", layout: "floral", fontFamily: "cormorant", coverStyle: "ornament", ornament: "rose", accent: "#d99aa3" },
  { name: "Sakura Putih", category: "Floral Blossom", palette: "rose", mood: "lembut", layout: "floral", fontFamily: "playfair", coverStyle: "ornament", ornament: "rose", accent: "#dc8aa6" },
  { name: "Asmara Pastel", category: "Floral Pastel", palette: "peach", mood: "hangat", layout: "floral", fontFamily: "cormorant", coverStyle: "arch", ornament: "leaves", accent: "#f0b48d" },
  { name: "Nusa Floral", category: "Floral Tropical", palette: "rose", mood: "tropis", layout: "floral", fontFamily: "dancing", coverStyle: "ornament", ornament: "rose", accent: "#d68fa9" },
  { name: "Bouquet Rose", category: "Floral Luxe", palette: "burgundy", mood: "mewah", layout: "floral", fontFamily: "playfair", coverStyle: "ornament", ornament: "rose", accent: "#c74d6a" },
  { name: "Peony Garden", category: "Floral Garden", palette: "blush", mood: "segar", layout: "floral", fontFamily: "italiana", coverStyle: "arch", ornament: "rose", accent: "#e5a0b0" },
  { name: "Lily White", category: "Floral Pure", palette: "pearl", mood: "suci", layout: "floral", fontFamily: "cormorant", coverStyle: "ornament", ornament: "leaves", accent: "#d4c8a0" },
  { name: "Orchid Dusk", category: "Floral Evening", palette: "midnight", mood: "misterius", layout: "floral", fontFamily: "bodoni", coverStyle: "ornament", ornament: "rose", accent: "#b88acd" },
  { name: "Tulip Spring", category: "Floral Fresh", palette: "peach", mood: "ceria", layout: "floral", fontFamily: "dancing", coverStyle: "arch", ornament: "rose", accent: "#f4a87d" },
  { name: "Jasmine Breeze", category: "Floral Calm", palette: "cream", mood: "tenang", layout: "floral", fontFamily: "cormorant", coverStyle: "ornament", ornament: "leaves", accent: "#c8b87a" },
];


// =========================================================
// BOTANICAL (8 templates)
// =========================================================
const botanicalTemplates: TemplateConfig[] = [
  { name: "Senja Garden", category: "Botanical Dusk", palette: "sage", mood: "natural", layout: "botanical", fontFamily: "playfair", coverStyle: "split", ornament: "leaves", accent: "#88a07c" },
  { name: "Teduh Sage", category: "Botanical Calm", palette: "sage", mood: "tenang", layout: "botanical", fontFamily: "cormorant", coverStyle: "arch", ornament: "leaves", accent: "#7d9978" },
  { name: "Surya Natural", category: "Botanical Earthy", palette: "olive", mood: "natural", layout: "botanical", fontFamily: "italiana", coverStyle: "split", ornament: "leaves", accent: "#b3b274" },
  { name: "Padma Calm", category: "Botanical Zen", palette: "sage", mood: "minim", layout: "botanical", fontFamily: "cormorant", coverStyle: "minimal", ornament: "leaves", accent: "#9bb190" },
  { name: "Fern Valley", category: "Botanical Deep", palette: "emerald", mood: "segar", layout: "botanical", fontFamily: "playfair", coverStyle: "split", ornament: "leaves", accent: "#6bba8a" },
  { name: "Eucalyptus", category: "Botanical Fresh", palette: "sage", mood: "segar", layout: "botanical", fontFamily: "italiana", coverStyle: "arch", ornament: "leaves", accent: "#8fb89a" },
  { name: "Moss Garden", category: "Botanical Forest", palette: "olive", mood: "dalam", layout: "botanical", fontFamily: "bodoni", coverStyle: "split", ornament: "leaves", accent: "#8a9e5c" },
  { name: "Pine Forest", category: "Botanical Wild", palette: "emerald", mood: "wild", layout: "botanical", fontFamily: "cinzel", coverStyle: "minimal", ornament: "geometric", accent: "#4d8a6a" },
];


// =========================================================
// MINIMAL (8 templates)
// =========================================================
const minimalTemplates: TemplateConfig[] = [
  { name: "Kirana Soft", category: "Minimal Clean", palette: "cream", mood: "bersih", layout: "minimal", fontFamily: "italiana", coverStyle: "minimal", ornament: "geometric", accent: "#c8a36a" },
  { name: "Purnama Clean", category: "Minimal Sand", palette: "sand", mood: "bersih", layout: "minimal", fontFamily: "italiana", coverStyle: "minimal", ornament: "geometric", accent: "#b9894b" },
  { name: "Arunika Simple", category: "Minimal Warm", palette: "cream", mood: "modern", layout: "minimal", fontFamily: "playfair", coverStyle: "minimal", ornament: "geometric", accent: "#c2965d" },
  { name: "Amerta Basic", category: "Minimal Bold", palette: "sand", mood: "tegas", layout: "minimal", fontFamily: "italiana", coverStyle: "minimal", ornament: "geometric", accent: "#b58348" },
  { name: "Mono White", category: "Minimal Mono", palette: "pearl", mood: "ultra bersih", layout: "minimal", fontFamily: "bodoni", coverStyle: "minimal", ornament: "geometric", accent: "#999" },
  { name: "Slate Clean", category: "Minimal Dark", palette: "onyx", mood: "modern", layout: "minimal", fontFamily: "italiana", coverStyle: "minimal", ornament: "geometric", accent: "#c4b48f" },
  { name: "Canvas Nude", category: "Minimal Nude", palette: "peach", mood: "hangat", layout: "minimal", fontFamily: "cormorant", coverStyle: "minimal", ornament: "wave", accent: "#d4a889" },
  { name: "Line Gold", category: "Minimal Gold", palette: "black-gold", mood: "mewah", layout: "minimal", fontFamily: "cinzel", coverStyle: "minimal", ornament: "geometric", accent: "#d7b46a" },
];


// =========================================================
// EDITORIAL (8 templates)
// =========================================================
const editorialTemplates: TemplateConfig[] = [
  { name: "Laras Modern", category: "Editorial Navy", palette: "navy", mood: "modern", layout: "editorial", fontFamily: "playfair", coverStyle: "split", ornament: "geometric", accent: "#25415f" },
  { name: "Elok Navy", category: "Editorial Bold", palette: "navy", mood: "tegas", layout: "editorial", fontFamily: "bodoni", coverStyle: "split", ornament: "wave", accent: "#1f3653" },
  { name: "Kencana Lite", category: "Editorial Sky", palette: "sky", mood: "lapang", layout: "editorial", fontFamily: "italiana", coverStyle: "split", ornament: "geometric", accent: "#9fc1d8" },
  { name: "Aristocrat Sage", category: "Editorial Green", palette: "emerald", mood: "editorial", layout: "editorial", fontFamily: "bodoni", coverStyle: "split", ornament: "wave", accent: "#6ed2a5" },
  { name: "Prestige Marble", category: "Editorial Stone", palette: "marble", mood: "editorial", layout: "editorial", fontFamily: "italiana", coverStyle: "split", ornament: "geometric", accent: "#c5cad2" },
  { name: "Couture Jasmine", category: "Editorial Soft", palette: "champagne", mood: "editorial", layout: "editorial", fontFamily: "playfair", coverStyle: "split", ornament: "wave", accent: "#e7c890" },
  { name: "Vogue Noir", category: "Editorial Dark", palette: "onyx", mood: "dramatis", layout: "editorial", fontFamily: "bodoni", coverStyle: "split", ornament: "geometric", accent: "#e0d4b8" },
  { name: "Harper Blush", category: "Editorial Blush", palette: "blush", mood: "lembut", layout: "editorial", fontFamily: "playfair", coverStyle: "split", ornament: "wave", accent: "#d49aab" },
];


// =========================================================
// ROYAL (8 templates)
// =========================================================
const royalTemplates: TemplateConfig[] = [
  { name: "Imperial Aurum", category: "Royal Gold", palette: "black-gold", mood: "majestic", layout: "royal", fontFamily: "cinzel", coverStyle: "ornament", ornament: "deco-frame", accent: "#d7b46a" },
  { name: "Velvet Royale", category: "Royal Burgundy", palette: "burgundy", mood: "dramatis", layout: "royal", fontFamily: "cinzel", coverStyle: "arch", ornament: "deco-frame", accent: "#d36b78" },
  { name: "Opulence Noir", category: "Royal Dark", palette: "onyx", mood: "mewah", layout: "royal", fontFamily: "cinzel", coverStyle: "ornament", ornament: "deco-frame", accent: "#c4b48f" },
  { name: "Golden Dynasty", category: "Royal Ivory", palette: "ivory-gold", mood: "majestic", layout: "royal", fontFamily: "cinzel", coverStyle: "arch", ornament: "deco-frame", accent: "#f1dfb8" },
  { name: "Royal Batavia", category: "Royal Blue", palette: "royal-blue", mood: "majestic", layout: "royal", fontFamily: "cinzel", coverStyle: "ornament", ornament: "stars", accent: "#7d9bd1" },
  { name: "Sovereign Emerald", category: "Royal Emerald", palette: "emerald", mood: "majestic", layout: "royal", fontFamily: "cinzel", coverStyle: "ornament", ornament: "deco-frame", accent: "#6ed2a5" },
  { name: "Ultra Signature", category: "Royal Ultra", palette: "black-gold", mood: "majestic", layout: "royal", fontFamily: "cinzel", coverStyle: "arch", ornament: "deco-frame", accent: "#d7b46a" },
  { name: "Crown Jewel", category: "Royal Midnight", palette: "midnight", mood: "majestic", layout: "royal", fontFamily: "cinzel", coverStyle: "ornament", ornament: "stars", accent: "#a8b8d8" },
];


// =========================================================
// CINEMATIC (8 templates)
// =========================================================
const cinematicTemplates: TemplateConfig[] = [
  { name: "Monarch Pearl", category: "Cinematic Night", palette: "midnight", mood: "cinematic", layout: "cinematic", fontFamily: "playfair", coverStyle: "photo", ornament: "stars", accent: "#98a2c2" },
  { name: "Eternal Diamond", category: "Cinematic Marble", palette: "marble", mood: "cinematic", layout: "cinematic", fontFamily: "bodoni", coverStyle: "photo", ornament: "geometric", accent: "#c5cad2" },
  { name: "Regal Moonlight", category: "Cinematic Moon", palette: "midnight", mood: "cinematic", layout: "cinematic", fontFamily: "playfair", coverStyle: "photo", ornament: "stars", accent: "#a3aed1" },
  { name: "The Heirloom", category: "Cinematic Heritage", palette: "onyx", mood: "cinematic", layout: "cinematic", fontFamily: "cormorant", coverStyle: "photo", ornament: "deco-frame", accent: "#bda474" },
  { name: "Luxe Aurora", category: "Cinematic Gold", palette: "ivory-gold", mood: "cinematic", layout: "cinematic", fontFamily: "italiana", coverStyle: "photo", ornament: "stars", accent: "#f1dfb8" },
  { name: "Silver Screen", category: "Cinematic Silver", palette: "marble", mood: "cinematic", layout: "cinematic", fontFamily: "bodoni", coverStyle: "photo", ornament: "geometric", accent: "#b8c0cc" },
  { name: "Grand Premiere", category: "Cinematic Premiere", palette: "black-gold", mood: "cinematic", layout: "cinematic", fontFamily: "cinzel", coverStyle: "photo", ornament: "deco-frame", accent: "#e8c872" },
  { name: "Noir Romance", category: "Cinematic Dark", palette: "onyx", mood: "cinematic", layout: "cinematic", fontFamily: "playfair", coverStyle: "photo", ornament: "stars", accent: "#a89070" },
];


// =========================================================
// LUXURY (8 templates)
// =========================================================
const luxuryTemplates: TemplateConfig[] = [
  { name: "Celestial Bloom", category: "Luxury Floral", palette: "ivory-gold", mood: "mewah", layout: "luxury", fontFamily: "cormorant", coverStyle: "ornament", ornament: "rose", accent: "#f1dfb8" },
  { name: "Palace Garden", category: "Luxury Garden", palette: "emerald", mood: "majestic", layout: "luxury", fontFamily: "playfair", coverStyle: "arch", ornament: "leaves", accent: "#6ed2a5" },
  { name: "Majestic Rose", category: "Luxury Rose", palette: "burgundy", mood: "dramatis", layout: "luxury", fontFamily: "playfair", coverStyle: "ornament", ornament: "rose", accent: "#d36b78" },
  { name: "Grand Chateau", category: "Luxury Estate", palette: "champagne", mood: "elegan", layout: "luxury", fontFamily: "cormorant", coverStyle: "arch", ornament: "leaves", accent: "#e7c890" },
  { name: "Elysian Ivory", category: "Luxury Pearl", palette: "pearl", mood: "suci", layout: "luxury", fontFamily: "italiana", coverStyle: "ornament", ornament: "deco-frame", accent: "#f3e6c9" },
  { name: "Versailles", category: "Luxury Grand", palette: "ivory-gold", mood: "grand", layout: "luxury", fontFamily: "cinzel", coverStyle: "ornament", ornament: "deco-frame", accent: "#d4b06a" },
  { name: "Monte Carlo", category: "Luxury Riviera", palette: "royal-blue", mood: "mewah", layout: "luxury", fontFamily: "bodoni", coverStyle: "arch", ornament: "stars", accent: "#7da4cc" },
  { name: "Dubai Gold", category: "Luxury Opulent", palette: "black-gold", mood: "majestic", layout: "luxury", fontFamily: "cinzel", coverStyle: "ornament", ornament: "deco-frame", accent: "#e8c462" },
];


// =========================================================
// ADAT / CULTURAL (5 templates)
// =========================================================
const adatTemplates: TemplateConfig[] = [
  { name: "Adat Jawa", category: "Adat Jawa", palette: "black-gold", mood: "agung", layout: "adat", fontFamily: "cinzel", coverStyle: "cultural", ornament: "jawa-batik", accent: "#c8a43a", culture: "jawa" },
  { name: "Adat Aceh", category: "Adat Aceh", palette: "emerald", mood: "megah", layout: "adat", fontFamily: "playfair", coverStyle: "cultural", ornament: "aceh-arch", accent: "#2e8b57", culture: "aceh" },
  { name: "Adat Batak", category: "Adat Batak", palette: "burgundy", mood: "kuat", layout: "adat", fontFamily: "cinzel", coverStyle: "cultural", ornament: "batak-gorga", accent: "#8b1a1a", culture: "batak" },
  { name: "Adat Minang", category: "Adat Minang", palette: "burgundy", mood: "megah", layout: "adat", fontFamily: "playfair", coverStyle: "cultural", ornament: "minang-rumah-gadang", accent: "#cc3333", culture: "minang" },
  { name: "Adat Lampung", category: "Adat Lampung", palette: "ivory-gold", mood: "agung", layout: "adat", fontFamily: "cinzel", coverStyle: "cultural", ornament: "lampung-siger", accent: "#d4a017", culture: "lampung" },
];


// =========================================================
// Combine all — 75 templates total, ALL free ultra premium
// =========================================================
const allConfigs: TemplateConfig[] = [
  ...classicTemplates,
  ...floralTemplates,
  ...botanicalTemplates,
  ...minimalTemplates,
  ...editorialTemplates,
  ...royalTemplates,
  ...cinematicTemplates,
  ...luxuryTemplates,
  ...adatTemplates
];

const DEFAULT_MUSIC_BY_LAYOUT: Record<TemplateLayout, string> = {
  classic: "/audio/soft-wedding-chime.wav",
  floral: "/audio/garden-love-chime.wav",
  botanical: "/audio/garden-love-chime.wav",
  minimal: "/audio/soft-wedding-chime.wav",
  editorial: "/audio/soft-wedding-chime.wav",
  royal: "/audio/royal-opening-chime.wav",
  cinematic: "/audio/royal-opening-chime.wav",
  luxury: "/audio/royal-opening-chime.wav",
  adat: "/audio/royal-opening-chime.wav"
};

export const templates: TemplateMeta[] = allConfigs.map((cfg, index) => ({
  slug: `template-${String(index + 1).padStart(3, "0")}`,
  name: cfg.name,
  tier: "free" as const,
  category: cfg.category,
  description: DESCRIPTION,
  palette: cfg.palette,
  mood: cfg.mood,
  animation: cfg.animation ?? (cfg.layout === "cinematic" ? "cinematic" : cfg.layout === "royal" || cfg.layout === "luxury" ? "royal" : cfg.layout === "editorial" ? "editorial" : "slide") as TemplateAnimation,
  accent: cfg.accent,
  features: FEATURES,
  layout: cfg.layout,
  fontFamily: cfg.fontFamily,
  coverStyle: cfg.coverStyle,
  ornament: cfg.ornament,
  culture: cfg.culture,
  music: DEFAULT_MUSIC_BY_LAYOUT[cfg.layout]
}));

const slugIndex = new Map(templates.map((t) => [t.slug, t]));
export function getTemplate(slug: string) { return slugIndex.get(slug); }
export function templatePrice() { return 0; }
export const freeTemplates = templates;
export const premiumTemplates: TemplateMeta[] = [];
