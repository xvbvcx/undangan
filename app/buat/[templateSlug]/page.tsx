import { redirect, notFound } from "next/navigation";
import { InvitationForm } from "@/components/InvitationForm";
import { getTemplate } from "@/lib/templates";
import { createClient } from "@/lib/supabase/server";

export default async function CreateInvitationPage({ params }: { params: Promise<{ templateSlug: string }> }) {
  const { templateSlug } = await params;
  const template = getTemplate(templateSlug);
  if (!template) notFound();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/buat/${templateSlug}`);
  return <InvitationForm template={template} />;
}
