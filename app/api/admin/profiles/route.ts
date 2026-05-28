import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { adminProfileActionSchema, reasonFromZod } from "@/lib/validators";

export async function POST(request: Request) {
  let admin;
  try { admin = await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const parsed = adminProfileActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  // Don't let an admin demote themselves into oblivion. Keep at least one admin.
  if (parsed.data.action === "demote" && parsed.data.userId === admin.id) {
    return NextResponse.json({ error: "Tidak bisa demote diri sendiri." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const newRole = parsed.data.action === "promote" ? "admin" : "user";
  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", parsed.data.userId);
  if (error) return NextResponse.json({ error: "Gagal mengubah role." }, { status: 400 });

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: `profile.${parsed.data.action}`,
    target_type: "profile",
    target_id: parsed.data.userId
  });

  return NextResponse.json({ ok: true, role: newRole });
}
