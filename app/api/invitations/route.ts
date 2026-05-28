import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getTemplate } from "@/lib/templates";
import { addDays } from "@/lib/format";

const schema = z.object({
  templateSlug: z.string(),
  slug: z.string().min(3),
  data: z.record(z.string(), z.any()),
  galleryUrls: z.array(z.string()).max(8).default([]),
  isPublished: z.boolean().default(true)
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data tidak valid." }, { status: 400 });
  const template = getTemplate(parsed.data.templateSlug);
  if (!template) return NextResponse.json({ error: "Template tidak ditemukan." }, { status: 404 });

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
  const { data: invitation, error } = await supabase.from("invitations").insert(payload).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ invitation });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });
  const { data, error } = await supabase.from("invitations").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ invitations: data });
}
