import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { invitationUpdateSchema, reasonFromZod } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const parsed = invitationUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  const { data: current } = await supabase
    .from("invitations")
    .select("id, slug, template_tier, payment_status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!current) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });

  const isPremiumLocked = current.template_tier === "premium" && current.payment_status !== "paid";

  // Slug change handling — preserve old slug in history so live links keep working.
  if (parsed.data.slug !== current.slug) {
    const { data: clash } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", parsed.data.slug)
      .neq("id", id)
      .maybeSingle();
    if (clash) return NextResponse.json({ error: "Slug sudah dipakai." }, { status: 409 });

    const { data: clashHistory } = await supabase
      .from("invitation_slug_history")
      .select("id, invitation_id")
      .eq("slug", parsed.data.slug)
      .maybeSingle();
    if (clashHistory && clashHistory.invitation_id !== id) {
      return NextResponse.json({ error: "Slug sudah pernah dipakai." }, { status: 409 });
    }

    await supabase.from("invitation_slug_history").upsert({
      invitation_id: id,
      slug: current.slug
    }, { onConflict: "slug" });
  }

  const { data: invitation, error } = await supabase
    .from("invitations")
    .update({
      slug: parsed.data.slug,
      data: parsed.data.data,
      gallery_urls: parsed.data.galleryUrls,
      music_url: parsed.data.data.musicUrl || null,
      is_published: parsed.data.isPublished && !isPremiumLocked,
      status: parsed.data.isPublished ? "published" : "draft",
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*")
    .single();
  if (error) {
    const userFacing = error.code === "23505"
      ? "Slug sudah dipakai. Pilih yang lain."
      : "Gagal menyimpan undangan.";
    return NextResponse.json({ error: userFacing }, { status: 400 });
  }
  return NextResponse.json({ invitation });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const { data: existing } = await supabase
    .from("invitations")
    .select("id, payment_status")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!existing) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });

  // Refuse to delete an undangan that's already paid — keep an audit trail of
  // money spent. Owner can archive instead.
  if (existing.payment_status === "paid") {
    const { error } = await supabase
      .from("invitations")
      .update({ status: "archived", is_published: false })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) return NextResponse.json({ error: "Gagal mengarsipkan." }, { status: 400 });
    return NextResponse.json({ ok: true, archived: true });
  }

  const { error } = await supabase
    .from("invitations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Gagal menghapus." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
