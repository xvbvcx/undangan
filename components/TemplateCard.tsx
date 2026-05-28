import Link from "next/link";
import type { TemplateMeta } from "@/lib/types";
import { Ornament } from "@/components/renderers/Ornaments";

// Layout-aware template card preview. The preview frame mimics the actual
// invitation layout so customers can see at-a-glance which template feels
// floral, royal, cinematic, etc., without having to open each one.
export function TemplateCard({ template }: { template: TemplateMeta }) {
  const isPremium = template.tier === "premium";
  return (
    <article className={`template-card ${isPremium ? "template-premium" : ""}`}>
      <div className="template-preview" style={{ "--accent": template.accent } as React.CSSProperties}>
        <div className={`phone-frame phone-${template.layout}`}>
          <div className={`mini-cover preview-${template.layout} font-${template.fontFamily}`}>
            <PreviewBody template={template} />
          </div>
        </div>
        {isPremium ? <span className="lock-glow">Premium · Unlock untuk publish</span> : null}
      </div>
      <div className="template-body">
        <div className="split">
          <span className={`badge ${isPremium ? "badge-premium" : "badge-free"}`}>
            {isPremium ? "Premium" : "Gratis"}
          </span>
          <span className="muted">{template.category}</span>
        </div>
        <h3 className="layout-display" style={{ color: template.accent }}>{template.name}</h3>
        <p>{template.description}</p>
        <div className="feature-row">
          {template.features.slice(0, 3).map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
        <div className="card-actions">
          <Link href={`/templates/${template.slug}`} className="button ghost">Preview</Link>
          <Link href={`/buat/${template.slug}`} className="button gold">Pakai template</Link>
        </div>
      </div>
    </article>
  );
}

// Layout-specific tiny cover content. Each branch keeps the same data ("A & R")
// but arranges + ornaments it differently to telegraph the template feel.
function PreviewBody({ template }: { template: TemplateMeta }) {
  const orn = template.ornament;
  switch (template.layout) {
    case "classic":
      return (
        <>
          <Ornament kind={orn} size={42} />
          <span className="mini-pill">Wedding Of</span>
          <h3>A & R</h3>
          <p>Save the date</p>
        </>
      );
    case "floral":
    case "botanical":
      return (
        <>
          <Ornament kind="rose" size={48} />
          <h3>A &amp; R</h3>
          <p>{template.layout === "botanical" ? "Garden Wedding" : "Floral Wedding"}</p>
        </>
      );
    case "minimal":
      return (
        <>
          <span className="mini-rule" style={{ display: "block", width: 32, height: 1, background: "currentColor", margin: "8px auto" }} />
          <span className="mini-pill" style={{ letterSpacing: ".25em", textTransform: "uppercase", fontSize: 9 }}>The Wedding</span>
          <h3 style={{ fontSize: 20 }}>A — R</h3>
          <span className="mini-rule" style={{ display: "block", width: 32, height: 1, background: "currentColor", margin: "8px auto" }} />
        </>
      );
    case "royal":
    case "luxury":
      return (
        <>
          <Ornament kind="deco-frame" size={68} />
          <span className="mini-pill" style={{ letterSpacing: ".3em", textTransform: "uppercase" }}>Royal</span>
          <h3 style={{ letterSpacing: ".08em" }}>A &amp; R</h3>
          <Ornament kind="deco-frame" size={68} />
        </>
      );
    case "cinematic":
      return (
        <>
          <Ornament kind="stars" size={42} />
          <span className="mini-pill" style={{ color: "rgba(255,255,255,.7)", letterSpacing: ".4em", textTransform: "uppercase", fontSize: 9 }}>Presents</span>
          <h3 style={{ color: "white", fontSize: 26 }}>A & R</h3>
          <p style={{ color: "rgba(255,255,255,.6)" }}>A Cinematic Wedding</p>
        </>
      );
    case "editorial":
      return (
        <>
          <span className="mini-pill" style={{ letterSpacing: ".3em", textTransform: "uppercase", fontSize: 9 }}>Vol. 01</span>
          <h3>A &amp; R</h3>
          <p style={{ fontStyle: "italic" }}>The Wedding Issue</p>
          <Ornament kind="wave" size={64} />
        </>
      );
    default:
      return (
        <>
          <div className="mini-couple">A & R</div>
          <h3>{template.name}</h3>
          <p>{template.mood}</p>
        </>
      );
  }
}
