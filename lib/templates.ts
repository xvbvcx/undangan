import type { TemplateMeta } from "@/lib/types";

const standardNames = [
  "Ayu Minimalis", "Sakura Putih", "Senja Garden", "Kirana Soft", "Seruni Classic",
  "Laras Modern", "Asmara Pastel", "Nusa Floral", "Purnama Clean", "Teduh Sage",
  "Dahayu Cream", "Melati Breeze", "Arunika Simple", "Cendana Warm", "Kencana Lite",
  "Surya Natural", "Padma Calm", "Elok Navy", "Rona Peach", "Amerta Basic"
];

const premiumNames = [
  "Imperial Aurum", "Velvet Royale", "Opulence Noir", "Celestial Bloom", "Monarch Pearl",
  "Golden Dynasty", "Elysian Ivory", "Palace Garden", "Sovereign Emerald", "Luxe Aurora",
  "Royal Batavia", "Majestic Rose", "Eternal Diamond", "Grand Chateau", "Couture Jasmine",
  "Aristocrat Sage", "Regal Moonlight", "Prestige Marble", "The Heirloom", "Ultra Signature"
];

// Each palette maps to a distinct CSS class in globals.css. Keep the lists
// short so the visual library stays curated and not random.
const standardPalettes = ["cream", "blush", "sage", "navy", "terracotta", "olive", "peach", "sand", "sky", "rose"] as const;
const premiumPalettes = ["black-gold", "ivory-gold", "emerald", "burgundy", "marble", "midnight", "champagne", "royal-blue", "onyx", "pearl"] as const;

const standardCategories = ["Minimalis", "Floral", "Modern", "Classic"] as const;
const premiumCategories = ["Ultra Exclusive", "Royal", "Editorial", "Luxury Floral"] as const;

const standardMoods = ["hangat", "bersih", "romantis", "natural"] as const;
const premiumMoods = ["mewah", "dramatis", "cinematic", "majestic"] as const;

const standardAccents = ["#b9894b", "#c78383", "#819276", "#25415f"] as const;
const premiumAccents = ["#d7b46a", "#f1dfb8", "#6ed2a5", "#c98a8a", "#bba8ff", "#ffb27a"] as const;

const premiumAnimations = ["cinematic", "royal", "editorial", "cinematic"] as const;

export const templates: TemplateMeta[] = [
  ...standardNames.map((name, index) => ({
    slug: `standar-${String(index + 1).padStart(2, "0")}`,
    name,
    tier: "free" as const,
    category: standardCategories[index % standardCategories.length],
    description: "Template standar yang tetap rapi, profesional, responsif, dan cocok untuk undangan elegan sehari-hari.",
    palette: standardPalettes[index % standardPalettes.length],
    mood: standardMoods[index % standardMoods.length],
    animation: "soft" as const,
    accent: standardAccents[index % standardAccents.length],
    features: ["Mobile-first", "Animasi loading", "Countdown", "RSVP", "Galeri 6–8 foto", "Watermark Nikah Kilat"]
  })),
  ...premiumNames.map((name, index) => ({
    slug: `premium-${String(index + 1).padStart(2, "0")}`,
    name,
    tier: "premium" as const,
    category: premiumCategories[index % premiumCategories.length],
    description: "Template premium ultra exclusive dengan komposisi visual, transisi, parallax, dan detail mewah yang jauh lebih kuat.",
    palette: premiumPalettes[index % premiumPalettes.length],
    mood: premiumMoods[index % premiumMoods.length],
    animation: premiumAnimations[index % premiumAnimations.length],
    accent: premiumAccents[index % premiumAccents.length],
    features: ["Ultra responsive", "Cinematic loading", "Parallax premium", "No watermark", "RSVP premium", "Galeri 6–8 foto", "Mode custom manual"]
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
