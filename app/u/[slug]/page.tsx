import { notFound } from "next/navigation";
import { InvitationRenderer } from "@/components/InvitationRenderer";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import type { InvitationRecord } from "@/lib/types";

export default async function PublicInvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: rawInvitation } = await supabase.from("invitations").select("*").eq("slug", slug).eq("is_published", true).single();
  const invitation = rawInvitation as InvitationRecord | null;
  if (!invitation) notFound();
  if (invitation.active_until && new Date(invitation.active_until).getTime() < Date.now()) notFound();
  if (invitation.template_tier === "premium" && invitation.payment_status !== "paid") notFound();
  const template = getTemplate(invitation.template_slug);
  if (!template) notFound();
  return <InvitationRenderer invitation={invitation} template={template} />;
}
