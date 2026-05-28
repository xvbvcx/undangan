import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { adminInvitationActionSchema, reasonFromZod } from "@/lib/validators";
import { addDays } from "@/lib/format";

export async function POST(request: Request) {
  let admin;
  try { admin = await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const parsed = adminInvitationActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  const supabase = createAdminClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, user_id, active_until, is_published")
    .eq("id", parsed.data.invitationId)
    .single();
  if (!invitation) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });

  switch (parsed.data.action) {
    case "delete": {
      const { error } = await supabase.from("invitations").delete().eq("id", invitation.id);
      if (error) return NextResponse.json({ error: "Gagal menghapus." }, { status: 400 });
      break;
    }
    case "unpublish": {
      const { error } = await supabase
        .from("invitations")
        .update({ is_published: false, status: "draft" })
        .eq("id", invitation.id);
      if (error) return NextResponse.json({ error: "Gagal unpublish." }, { status: 400 });
      break;
    }
    case "publish": {
      const { error } = await supabase
        .from("invitations")
        .update({ is_published: true, status: "published" })
        .eq("id", invitation.id);
      if (error) return NextResponse.json({ error: "Gagal publish." }, { status: 400 });
      break;
    }
    case "extend": {
      const days = parsed.data.days ?? 30;
      const now = new Date();
      const base = invitation.active_until && new Date(invitation.active_until) > now
        ? new Date(invitation.active_until)
        : now;
      const newActiveUntil = addDays(base, days).toISOString();
      const { error } = await supabase
        .from("invitations")
        .update({ active_until: newActiveUntil })
        .eq("id", invitation.id);
      if (error) return NextResponse.json({ error: "Gagal extend." }, { status: 400 });
      break;
    }
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: `invitation.${parsed.data.action}`,
    target_type: "invitation",
    target_id: invitation.id,
    metadata: { days: parsed.data.days ?? null }
  });

  return NextResponse.json({ ok: true });
}
