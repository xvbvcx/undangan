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

const standardPalettes = ["cream", "blush", "sage", "navy", "terracotta", "olive", "peach", "sand", "sky", "rose"];
const premiumPalettes = ["black-gold", "ivory-gold", "emerald", "burgundy", "marble", "midnight", "champagne", "royal-blue", "onyx", "pearl"];

export const templates: TemplateMeta[] = [
  ...standardNames.map((name, index) => ({
    slug: `standar-${String(index + 1).padStart(2, "0")}`,
    name,
    tier: "free" as const,
    category: ["Minimalis", "Floral", "Modern", "Classic"][index % 4],
    description: "Template standar yang tetap rapi, profesional, responsif, dan cocok untuk undangan elegan sehari-hari.",
    palette: standardPalettes[index % standardPalettes.length],
    mood: ["hangat", "bersih", "romantis", "natural"][index % 4],
    animation: "soft" as const,
    accent: ["#b9894b", "#c78383", "#819276", "#25415f"][index % 4],
    features: ["Mobile-first", "Animasi loading", "Countdown", "RSVP", "Galeri 6–8 foto", "Watermark Nikah Kilat"]
  })),
  ...premiumNames.map((name, index) => ({
    slug: `premium-${String(index + 1).padStart(2, "0")}`,
    name,
    tier: "premium" as const,
    category: ["Ultra Exclusive", "Royal", "Editorial", "Luxury Floral"][index % 4],
    description: "Template premium ultra exclusive dengan komposisi visual, transisi, parallax, dan detail mewah yang jauh lebih kuat.",
    palette: premiumPalettes[index % premiumPalettes.length],
    mood: ["mewah", "dramatis", "cinematic", "majestic"][index % 4],
    animation: ["cinematic", "royal", "editorial", "cinematic"][index % 4] as TemplateMeta["animation"],
    accent: ["#d7b46a", "#f1dfb8", "#6ed2a5", "#c98a8a"][index % 4],
    features: ["Ultra responsive", "Cinematic loading", "Parallax premium", "No watermark", "RSVP premium", "Galeri 6–8 foto", "Mode custom manual"]
  }))
];

export const freeTemplates = templates.filter((template) => template.tier === "free");
export const premiumTemplates = templates.filter((template) => template.tier === "premium");

export function getTemplate(slug: string) {
  return templates.find((template) => template.slug === slug);
}

export function templatePrice() {
  return Number(process.env.PREMIUM_PRICE || 299000);
}
