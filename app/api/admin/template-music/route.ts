import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { adminTemplateMusicDeleteSchema, adminTemplateMusicSchema, reasonFromZod } from "@/lib/validators";
import { getTemplate } from "@/lib/templates";

// List all music overrides currently set by admins. Used by the admin panel
// to render existing assignments and let admins edit/delete them.
export async function GET() {
  let admin;
  try { admin = await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("template_music")
    .select("id, template_slug, music_url, label, updated_at")
    .order("template_slug", { ascending: true });
  if (error) return NextResponse.json({ error: "Gagal memuat data." }, { status: 400 });
  return NextResponse.json({ overrides: data ?? [], actorId: admin.id });
}

// Upsert an override for a given template_slug. Falling back to the template
// default is just a matter of deleting the row (DELETE method below).
export async function POST(request: Request) {
  let admin;
  try { admin = await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const parsed = adminTemplateMusicSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  // Refuse overrides for unknown templates so admins don't accidentally pin
  // music to slugs that no longer exist after a code change.
  if (!getTemplate(parsed.data.templateSlug)) {
    return NextResponse.json({ error: "Template tidak ditemukan." }, { status: 404 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("template_music").upsert(
    {
      template_slug: parsed.data.templateSlug,
      music_url: parsed.data.musicUrl,
      label: parsed.data.label || null,
      updated_by: admin.id,
      updated_at: new Date().toISOString()
    },
    { onConflict: "template_slug" }
  );
  if (error) return NextResponse.json({ error: "Gagal menyimpan." }, { status: 400 });

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "template_music.upsert",
    target_type: "template",
    target_id: null,
    metadata: { template_slug: parsed.data.templateSlug, music_url: parsed.data.musicUrl }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  let admin;
  try { admin = await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const parsed = adminTemplateMusicDeleteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  const supabase = createAdminClient();
  const { error } = await supabase.from("template_music").delete().eq("template_slug", parsed.data.templateSlug);
  if (error) return NextResponse.json({ error: "Gagal menghapus." }, { status: 400 });

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: "template_music.delete",
    target_type: "template",
    target_id: null,
    metadata: { template_slug: parsed.data.templateSlug }
  });

  return NextResponse.json({ ok: true });
}
