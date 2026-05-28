import { permanentRedirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import type { InvitationRecord } from "@/lib/types";
import { sanitizeText } from "@/lib/sanitize";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function loadInvitation(slug: string) {
  const supabase = await createClient();

  const { data: rawInvitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (rawInvitation) return { invitation: rawInvitation as InvitationRecord, redirect: null };

  // Fall back to slug history so previously shared links keep resolving.
  const { data: history } = await supabase
    .from("invitation_slug_history")
    .select("invitation_id")
    .eq("slug", slug)
    .maybeSingle();
  if (history?.invitation_id) {
    const { data: current } = await supabase
      .from("invitations")
      .select("slug, is_published")
      .eq("id", history.invitation_id)
      .maybeSingle();
    if (current?.is_published) return { invitation: null, redirect: current.slug };
  }
  return { invitation: null, redirect: null };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { invitation } = await loadInvitation(slug);
  if (!invitation) return { title: "Undangan tidak ditemukan", robots: { index: false } };

  const data = invitation.data ?? {};
  const groom = data.groomNickname || data.groomName || "Mempelai";
  const bride = data.brideNickname || data.brideName || "Pasangan";
  const title = `${groom} & ${bride}`;
  const cover = invitation.gallery_urls?.[0];

  return {
    title,
    description: data.openingText || `Undangan pernikahan ${groom} & ${bride}.`,
    openGraph: {
      title,
      description: data.openingText || `Undangan pernikahan ${groom} & ${bride}.`,
      type: "website",
      images: cover ? [{ url: cover, width: 1200, height: 630, alt: title }] : []
    },
    twitter: {
      card: cover ? "summary_large_image" : "summary",
      title,
      description: data.openingText || `Undangan pernikahan ${groom} & ${bride}.`,
      images: cover ? [cover] : []
    }
  };
}

export default async function PublicInvitationPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { invitation, redirect } = await loadInvitation(slug);

  if (redirect) permanentRedirect(`/u/${redirect}`);
  if (!invitation) notFound();
  if (invitation.active_until && new Date(invitation.active_until).getTime() < Date.now()) notFound();
  if (invitation.template_tier === "premium" && invitation.payment_status !== "paid") notFound();

  const template = getTemplate(invitation.template_slug);
  if (!template) notFound();

  const sp = await searchParams;
  const rawGuest = Array.isArray(sp.to) ? sp.to[0] : sp.to;
  const rawGuestSlug = Array.isArray(sp.k) ? sp.k[0] : sp.k;
  const guestName = sanitizeText(rawGuest ?? "", 80);
  const guestSlug = sanitizeText(rawGuestSlug ?? "", 80);

  return (
    <InvitationRenderer
      invitation={invitation}
      template={template}
      guestName={guestName || undefined}
      guestSlug={guestSlug || undefined}
    />
  );
}
