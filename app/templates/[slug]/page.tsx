import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { getTemplate, templates } from "@/lib/templates";
import { emptyInvitationData } from "@/lib/types";

export function generateStaticParams() {
  return templates.map((template) => ({ slug: template.slug }));
}

export default async function TemplatePreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplate(slug);
  if (!template) notFound();
  const demo = {
    id: "preview",
    slug: "preview",
    data: {
      ...emptyInvitationData,
      groomName: "Raka Pratama",
      groomNickname: "Raka",
      brideName: "Nadia Maharani",
      brideNickname: "Nadia",
      groomFather: "H. Arman",
      groomMother: "Hj. Laras",
      brideFather: "H. Surya",
      brideMother: "Hj. Melati",
      akadDate: "2026-08-08",
      akadTime: "08.00 WIB",
      akadVenue: "Masjid Agung",
      akadAddress: "Jl. Bahagia No. 1",
      receptionDate: "2026-08-08",
      receptionTime: "11.00 - 14.00 WIB",
      receptionVenue: "Grand Ballroom",
      receptionAddress: "Jl. Cinta Abadi No. 8"
    },
    gallery_urls: []
  };
  return (
    <main>
      <div className="preview-toolbar">
        <Link href="/#template" className="button ghost">← Kembali</Link>
        <div><strong>{template.name}</strong><span>Ultra Premium Gratis</span></div>
        <Link href={`/buat/${template.slug}`} className="button gold">Gunakan template</Link>
      </div>
      <InvitationRenderer invitation={demo} template={template} preview />
    </main>
  );
}
