import type { MetadataRoute } from "next";
import { templates } from "@/lib/templates";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nikahkilat.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/templates-page`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    ...templates.map((template) => ({
      url: `${siteUrl}/templates/${template.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7
    }))
  ];
}
