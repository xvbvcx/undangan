import Link from "next/link";
import type { TemplateMeta } from "@/lib/types";

export function TemplateCard({ template, compact = false }: { template: TemplateMeta; compact?: boolean }) {
  const premium = template.tier === "premium";
  return (
    <article className={`template-card ${premium ? "template-premium" : "template-free"}`}>
      <div className={`template-preview palette-${template.palette}`}>
        <div className="phone-frame">
          <div className="mini-cover">
            <span className="mini-pill">{premium ? "ULTRA" : "STANDAR"}</span>
            <h3>{template.name}</h3>
            <p>{premium ? "Cinematic • No Watermark" : "Profesional • Watermark"}</p>
            <div className="mini-couple">A & R</div>
          </div>
        </div>
        {premium ? <div className="lock-glow">🔒 Preview Premium</div> : null}
      </div>
      <div className="template-body">
        <div className="split">
          <span className={`badge ${premium ? "badge-premium" : "badge-free"}`}>{premium ? "Premium Ultra" : "Gratis"}</span>
          <span className="muted">{template.category}</span>
        </div>
        <h3>{template.name}</h3>
        {!compact ? <p>{template.description}</p> : null}
        <div className="feature-row">
          {template.features.slice(0, 3).map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
        <div className="card-actions">
          <Link href={`/templates/${template.slug}`} className="button ghost">Preview</Link>
          <Link href={`/buat/${template.slug}`} className={premium ? "button gold" : "button dark"}>
            {premium ? "Pakai Premium" : "Gunakan Gratis"}
          </Link>
        </div>
      </div>
    </article>
  );
}
