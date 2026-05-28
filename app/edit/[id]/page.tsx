import { redirect, notFound } from "next/navigation";
import { InvitationForm } from "@/components/InvitationForm";
import { getTemplate } from "@/lib/templates";
import { createClient } from "@/lib/supabase/server";
import type { InvitationRecord } from "@/lib/types";

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: rawInvitation } = await supabase.from("invitations").select("*").eq("id", id).eq("user_id", user.id).single();
  const invitation = rawInvitation as InvitationRecord | null;
  if (!invitation) notFound();
  const template = getTemplate(invitation.template_slug);
  if (!template) notFound();
  return <InvitationForm template={template} initial={invitation} />;
}
