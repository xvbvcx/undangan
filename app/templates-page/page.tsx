import Link from "next/link";
import { TemplateGrid } from "@/components/TemplateGrid";
import { templates } from "@/lib/templates";

export const metadata = { title: "Pilih Template" };

export default function TemplatesIndexPage() {
  return (
    <main>
      <div className="dash-topbar">
        <Link href="/" className="brand-mark"><span className="brand-orb">NK</span><strong>Nikah Kilat</strong></Link>
        <Link href="/dashboard" className="button ghost">Dashboard</Link>
      </div>
      <TemplateGrid templates={templates} />
    </main>
  );
}
