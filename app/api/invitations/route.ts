import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import { addDays } from "@/lib/format";
import { invitationCreateSchema, reasonFromZod } from "@/lib/validators";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const parsed = invitationCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  const template = getTemplate(parsed.data.templateSlug);
  if (!template) return NextResponse.json({ error: "Template tidak ditemukan." }, { status: 404 });

  // Reject duplicate slug or one currently parked in slug history.
  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "Slug sudah dipakai. Pilih yang lain." }, { status: 409 });

  const { data: history } = await supabase
    .from("invitation_slug_history")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (history) return NextResponse.json({ error: "Slug sudah pernah dipakai. Pilih yang lain." }, { status: 409 });

  const premium = template.tier === "premium";
  const payload = {
    user_id: user.id,
    slug: parsed.data.slug,
    template_slug: template.slug,
    template_tier: template.tier,
    package_type: premium ? "premium" : "free",
    payment_status: premium ? "pending" : "not_required",
    status: parsed.data.isPublished ? "published" : "draft",
    is_published: parsed.data.isPublished && !premium,
    data: parsed.data.data,
    gallery_urls: parsed.data.galleryUrls,
    music_url: parsed.data.data.musicUrl || null,
    active_until: addDays(new Date(), 30).toISOString()
  };

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert(payload)
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

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Gagal memuat undangan." }, { status: 400 });
  return NextResponse.json({ invitations: data });
}
