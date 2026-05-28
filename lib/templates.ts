import type { TemplateMeta, TemplateLayout, TemplateFontFamily, TemplateCoverStyle, TemplateOrnament } from "@/lib/types";

// =========================================================
// Free templates (20)
// =========================================================
const standardConfigs: Array<{
  name: string;
  category: string;
  palette: string;
  mood: string;
  layout: TemplateLayout;
  fontFamily: TemplateFontFamily;
  coverStyle: TemplateCoverStyle;
  ornament: TemplateOrnament;
  accent: string;
}> = [
  // Floral cluster — soft pastel, romantic
  { name: "Ayu Minimalis",   category: "Minimalis Floral",  palette: "blush",       mood: "romantis",    layout: "floral",    fontFamily: "cormorant", coverStyle: "ornament", ornament: "rose",       accent: "#d99aa3" },
  { name: "Sakura Putih",    category: "Floral",            palette: "rose",        mood: "lembut",      layout: "floral",    fontFamily: "playfair",  coverStyle: "ornament", ornament: "rose",       accent: "#dc8aa6" },
  { name: "Asmara Pastel",   category: "Pastel Floral",     palette: "peach",       mood: "hangat",      layout: "floral",    fontFamily: "cormorant", coverStyle: "arch",     ornament: "leaves",     accent: "#f0b48d" },
  { name: "Nusa Floral",     category: "Tropical Floral",   palette: "rose",        mood: "tropis",      layout: "floral",    fontFamily: "dancing",   coverStyle: "ornament", ornament: "rose",       accent: "#d68fa9" },

  // Botanical / sage — green calm
  { name: "Senja Garden",    category: "Botanical",         palette: "sage",        mood: "natural",     layout: "botanical", fontFamily: "playfair",  coverStyle: "split",    ornament: "leaves",     accent: "#88a07c" },
  { name: "Teduh Sage",      category: "Botanical",         palette: "sage",        mood: "tenang",      layout: "botanical", fontFamily: "cormorant", coverStyle: "arch",     ornament: "leaves",     accent: "#7d9978" },
  { name: "Surya Natural",   category: "Earthy Botanical",  palette: "olive",       mood: "natural",     layout: "botanical", fontFamily: "italiana",  coverStyle: "split",    ornament: "leaves",     accent: "#b3b274" },
  { name: "Padma Calm",      category: "Sage Modern",       palette: "sage",        mood: "minim",       layout: "botanical", fontFamily: "cormorant", coverStyle: "minimal",  ornament: "leaves",     accent: "#9bb190" },

  // Minimalist clean
  { name: "Kirana Soft",     category: "Minimalis Clean",   palette: "cream",       mood: "bersih",      layout: "minimal",   fontFamily: "italiana",  coverStyle: "minimal",  ornament: "geometric",  accent: "#c8a36a" },
  { name: "Purnama Clean",   category: "Minimalis",         palette: "sand",        mood: "bersih",      layout: "minimal",   fontFamily: "italiana",  coverStyle: "minimal",  ornament: "geometric",  accent: "#b9894b" },
  { name: "Arunika Simple",  category: "Minimalis",         palette: "cream",       mood: "modern",      layout: "minimal",   fontFamily: "playfair",  coverStyle: "minimal",  ornament: "geometric",  accent: "#c2965d" },
  { name: "Amerta Basic",    category: "Minimalis",         palette: "sand",        mood: "tegas",       layout: "minimal",   fontFamily: "italiana",  coverStyle: "minimal",  ornament: "geometric",  accent: "#b58348" },

  // Classic centered romantic
  { name: "Seruni Classic",  category: "Classic Romantic",  palette: "blush",       mood: "romantis",    layout: "classic",   fontFamily: "playfair",  coverStyle: "arch",     ornament: "rose",       accent: "#c78383" },
  { name: "Dahayu Cream",    category: "Classic",           palette: "cream",       mood: "elegan",      layout: "classic",   fontFamily: "cormorant", coverStyle: "ornament", ornament: "deco-frame", accent: "#c8a36a" },
  { name: "Cendana Warm",    category: "Classic Warm",      palette: "terracotta",  mood: "hangat",      layout: "classic",   fontFamily: "cormorant", coverStyle: "ornament", ornament: "deco-frame", accent: "#d39062" },
  { name: "Melati Breeze",   category: "Classic Floral",    palette: "cream",       mood: "lembut",      layout: "classic",   fontFamily: "dancing",   coverStyle: "arch",     ornament: "rose",       accent: "#cb9c64" },
  { name: "Rona Peach",      category: "Romantic",          palette: "peach",       mood: "manis",       layout: "classic",   fontFamily: "playfair",  coverStyle: "ornament", ornament: "rose",       accent: "#e89a72" },

  // Modern editorial
  { name: "Laras Modern",    category: "Editorial",         palette: "navy",        mood: "modern",      layout: "editorial", fontFamily: "playfair",  coverStyle: "split",    ornament: "geometric",  accent: "#25415f" },
  { name: "Elok Navy",       category: "Editorial",         palette: "navy",        mood: "tegas",       layout: "editorial", fontFamily: "bodoni",    coverStyle: "split",    ornament: "wave",       accent: "#1f3653" },
  { name: "Kencana Lite",    category: "Editorial Sand",    palette: "sky",         mood: "lapang",      layout: "editorial", fontFamily: "italiana",  coverStyle: "split",    ornament: "geometric",  accent: "#9fc1d8" }
];

// =========================================================
// Premium templates (20)
// =========================================================
const premiumConfigs: Array<{
  name: string;
  category: string;
  palette: string;
  mood: string;
  layout: TemplateLayout;
  fontFamily: TemplateFontFamily;
  coverStyle: TemplateCoverStyle;
  ornament: TemplateOrnament;
  accent: string;
}> = [
  // Royal black-gold luxe
  { name: "Imperial Aurum",   category: "Royal",          palette: "black-gold",  mood: "majestic",  layout: "royal",     fontFamily: "cinzel",    coverStyle: "ornament", ornament: "deco-frame", accent: "#d7b46a" },
  { name: "Velvet Royale",    category: "Royal",          palette: "burgundy",    mood: "dramatis",  layout: "royal",     fontFamily: "cinzel",    coverStyle: "arch",     ornament: "deco-frame", accent: "#d36b78" },
  { name: "Opulence Noir",    category: "Royal Dark",     palette: "onyx",        mood: "mewah",     layout: "royal",     fontFamily: "cinzel",    coverStyle: "ornament", ornament: "deco-frame", accent: "#c4b48f" },
  { name: "Golden Dynasty",   category: "Royal Gold",     palette: "ivory-gold",  mood: "majestic",  layout: "royal",     fontFamily: "cinzel",    coverStyle: "arch",     ornament: "deco-frame", accent: "#f1dfb8" },
  { name: "Royal Batavia",    category: "Royal Heritage", palette: "royal-blue",  mood: "majestic",  layout: "royal",     fontFamily: "cinzel",    coverStyle: "ornament", ornament: "stars",      accent: "#7d9bd1" },

  // Cinematic dark luxe
  { name: "Monarch Pearl",    category: "Cinematic",      palette: "midnight",    mood: "cinematic", layout: "cinematic", fontFamily: "playfair",  coverStyle: "photo",    ornament: "stars",      accent: "#98a2c2" },
  { name: "Eternal Diamond",  category: "Cinematic",      palette: "marble",      mood: "cinematic", layout: "cinematic", fontFamily: "bodoni",    coverStyle: "photo",    ornament: "geometric",  accent: "#c5cad2" },
  { name: "Regal Moonlight",  category: "Cinematic Dark", palette: "midnight",    mood: "cinematic", layout: "cinematic", fontFamily: "playfair",  coverStyle: "photo",    ornament: "stars",      accent: "#a3aed1" },
  { name: "The Heirloom",     category: "Cinematic",      palette: "onyx",        mood: "cinematic", layout: "cinematic", fontFamily: "cormorant", coverStyle: "photo",    ornament: "deco-frame", accent: "#bda474" },

  // Editorial magazine premium
  { name: "Aristocrat Sage",  category: "Editorial",      palette: "emerald",     mood: "editorial", layout: "editorial", fontFamily: "bodoni",    coverStyle: "split",    ornament: "wave",       accent: "#6ed2a5" },
  { name: "Prestige Marble",  category: "Editorial",      palette: "marble",      mood: "editorial", layout: "editorial", fontFamily: "italiana",  coverStyle: "split",    ornament: "geometric",  accent: "#c5cad2" },
  { name: "Couture Jasmine",  category: "Editorial Soft", palette: "champagne",   mood: "editorial", layout: "editorial", fontFamily: "playfair",  coverStyle: "split",    ornament: "wave",       accent: "#e7c890" },

  // Luxury floral
  { name: "Celestial Bloom",  category: "Luxury Floral",  palette: "ivory-gold",  mood: "mewah",     layout: "luxury",    fontFamily: "cormorant", coverStyle: "ornament", ornament: "rose",       accent: "#f1dfb8" },
  { name: "Palace Garden",    category: "Luxury Floral",  palette: "emerald",     mood: "majestic",  layout: "luxury",    fontFamily: "playfair",  coverStyle: "arch",     ornament: "leaves",     accent: "#6ed2a5" },
  { name: "Majestic Rose",    category: "Luxury Floral",  palette: "burgundy",    mood: "dramatis",  layout: "luxury",    fontFamily: "playfair",  coverStyle: "ornament", ornament: "rose",       accent: "#d36b78" },
  { name: "Grand Chateau",    category: "Luxury Floral",  palette: "champagne",   mood: "elegan",    layout: "luxury",    fontFamily: "cormorant", coverStyle: "arch",     ornament: "leaves",     accent: "#e7c890" },

  // Pearl / pristine luxury
  { name: "Elysian Ivory",    category: "Pearl",          palette: "pearl",       mood: "elegan",    layout: "luxury",    fontFamily: "italiana",  coverStyle: "ornament", ornament: "deco-frame", accent: "#f3e6c9" },
  { name: "Sovereign Emerald", category: "Royal Emerald", palette: "emerald",     mood: "majestic",  layout: "royal",     fontFamily: "cinzel",    coverStyle: "ornament", ornament: "deco-frame", accent: "#6ed2a5" },
  { name: "Luxe Aurora",      category: "Cinematic Soft", palette: "ivory-gold",  mood: "cinematic", layout: "cinematic", fontFamily: "italiana",  coverStyle: "photo",    ornament: "stars",      accent: "#f1dfb8" },
  { name: "Ultra Signature",  category: "Ultra Exclusive", palette: "black-gold", mood: "majestic", layout: "royal",     fontFamily: "cinzel",    coverStyle: "arch",     ornament: "deco-frame", accent: "#d7b46a" }
];

// Default music distribution per layout. Admin can override per-template via
// the `template_music` table at runtime — see /api/admin/template-music.
const DEFAULT_MUSIC_BY_LAYOUT: Record<TemplateLayout, string> = {
  classic:    "/audio/soft-wedding-chime.wav",
  floral:     "/audio/garden-love-chime.wav",
  botanical:  "/audio/garden-love-chime.wav",
  minimal:    "/audio/soft-wedding-chime.wav",
  editorial:  "/audio/soft-wedding-chime.wav",
  royal:      "/audio/royal-opening-chime.wav",
  cinematic:  "/audio/royal-opening-chime.wav",
  luxury:     "/audio/royal-opening-chime.wav"
};

const FREE_DESCRIPTION =
  "Template gratis dengan tata letak rapi, tipografi elegan, dan animasi soft. Cocok untuk undangan profesional sehari-hari.";
const PREMIUM_DESCRIPTION =
  "Template premium ultra exclusive dengan layout sinematik, font display mewah, ornamen kustom, dan animasi yang lebih kuat.";

const FREE_FEATURES = ["Mobile-first", "Animasi loading", "Countdown", "RSVP", "Galeri 6–8 foto", "Watermark Nikah Kilat"];
const PREMIUM_FEATURES = ["Layout eksklusif", "Tipografi mewah", "Animasi premium", "No watermark", "RSVP premium", "Galeri 6–8 foto"];

export const templates: TemplateMeta[] = [
  ...standardConfigs.map((cfg, index) => ({
    slug: `standar-${String(index + 1).padStart(2, "0")}`,
    name: cfg.name,
    tier: "free" as const,
    category: cfg.category,
    description: FREE_DESCRIPTION,
    palette: cfg.palette,
    mood: cfg.mood,
    animation: "soft" as const,
    accent: cfg.accent,
    features: FREE_FEATURES,
    layout: cfg.layout,
    fontFamily: cfg.fontFamily,
    coverStyle: cfg.coverStyle,
    ornament: cfg.ornament,
    music: DEFAULT_MUSIC_BY_LAYOUT[cfg.layout]
  })),
  ...premiumConfigs.map((cfg, index) => ({
    slug: `premium-${String(index + 1).padStart(2, "0")}`,
    name: cfg.name,
    tier: "premium" as const,
    category: cfg.category,
    description: PREMIUM_DESCRIPTION,
    palette: cfg.palette,
    mood: cfg.mood,
    animation: cfg.layout === "cinematic" ? "cinematic" as const
              : cfg.layout === "royal"     ? "royal" as const
              : cfg.layout === "editorial" ? "editorial" as const
              : "cinematic" as const,
    accent: cfg.accent,
    features: PREMIUM_FEATURES,
    layout: cfg.layout,
    fontFamily: cfg.fontFamily,
    coverStyle: cfg.coverStyle,
    ornament: cfg.ornament,
    music: DEFAULT_MUSIC_BY_LAYOUT[cfg.layout]
  }))
];

export const freeTemplates = templates.filter((template) => template.tier === "free");
export const premiumTemplates = templates.filter((template) => template.tier === "premium");

const slugIndex = new Map(templates.map((template) => [template.slug, template]));

export function getTemplate(slug: string) {
  return slugIndex.get(slug);
}

export function templatePrice() {
  const raw = Number(process.env.PREMIUM_PRICE || 299000);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : 299000;
}
