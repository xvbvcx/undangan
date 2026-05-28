"use client";

import { useMemo, useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import type { TemplateMeta } from "@/lib/types";

type FilterKey = "all" | "classic" | "sidebar" | "floral" | "botanical" | "minimal" | "editorial" | "royal" | "cinematic" | "luxury" | "postcard" | "mosaic" | "parallax" | "adat";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "Semua 75+" },
  { key: "sidebar", label: "Sidebar" },
  { key: "classic", label: "Classic" },
  { key: "floral", label: "Floral" },
  { key: "botanical", label: "Botanical" },
  { key: "minimal", label: "Minimal" },
  { key: "editorial", label: "Editorial" },
  { key: "royal", label: "Royal" },
  { key: "cinematic", label: "Cinematic" },
  { key: "luxury", label: "Luxury" },
  { key: "postcard", label: "Postcard" },
  { key: "mosaic", label: "Mosaic" },
  { key: "parallax", label: "Parallax" },
  { key: "adat", label: "Adat Nusantara" },
];

export function TemplateGrid({ templates }: { templates: TemplateMeta[] }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const filtered = useMemo(
    () => filter === "all" ? templates : templates.filter((t) => t.layout === filter),
    [filter, templates]
  );

  return (
    <section id="template" className="section">
      <div className="section-head">
        <span className="eyebrow">75+ template ultra premium gratis</span>
        <h2>Pilih layout yang sesuai selera — semuanya eksklusif tanpa batas.</h2>
        <p>9 layout berbeda, 5 tema adat Nusantara, scroll animations, tanpa watermark.</p>
      </div>
      <div className="filter-tabs" role="tablist" aria-label="Filter template">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={filter === f.key ? "active" : ""}
            role="tab"
            aria-selected={filter === f.key}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="template-grid">
        {filtered.map((template) => <TemplateCard key={template.slug} template={template} />)}
      </div>
    </section>
  );
}
