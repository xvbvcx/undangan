"use client";

import { useMemo, useState } from "react";
import { TemplateCard } from "@/components/TemplateCard";
import type { TemplateMeta } from "@/lib/types";

export function TemplateGrid({ templates }: { templates: TemplateMeta[] }) {
  const [filter, setFilter] = useState<"all" | "free" | "premium">("all");
  const filtered = useMemo(() => templates.filter((t) => filter === "all" || t.tier === filter), [filter, templates]);
  return (
    <section id="template" className="section">
      <div className="section-head">
        <span className="eyebrow">40 template siap preview</span>
        <h2>Standar tetap cantik, premium dibuat jauh lebih menggoda.</h2>
        <p>Semua template bisa dilihat tanpa login. Premium tetap bisa dipreview, tapi untuk publish wajib unlock.</p>
      </div>
      <div className="filter-tabs" role="tablist" aria-label="Filter template">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>Semua 40</button>
        <button onClick={() => setFilter("free")} className={filter === "free" ? "active" : ""}>20 Gratis</button>
        <button onClick={() => setFilter("premium")} className={filter === "premium" ? "active" : ""}>20 Premium</button>
      </div>
      <div className="template-grid">
        {filtered.map((template) => <TemplateCard key={template.slug} template={template} compact />)}
      </div>
    </section>
  );
}
