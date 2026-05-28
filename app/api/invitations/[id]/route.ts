import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  slug: z.string().min(3),
  data: z.record(z.string(), z.any()),
  galleryUrls: z.array(z.string()).max(8).default([]),
  isPublished: z.boolean().default(true)
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Data tidak valid." }, { status: 400 });
  const { data: current } = await supabase.from("invitations").select("template_tier, payment_status").eq("id", id).eq("user_id", user.id).single();
  if (!current) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  const isPremiumLocked = current.template_tier === "premium" && current.payment_status !== "paid";
  const { data: invitation, error } = await supabase.from("invitations").update({
    slug: parsed.data.slug,
    data: parsed.data.data,
    gallery_urls: parsed.data.galleryUrls,
    music_url: parsed.data.data.musicUrl || null,
    is_published: parsed.data.isPublished && !isPremiumLocked,
    status: parsed.data.isPublished ? "published" : "draft",
    updated_at: new Date().toISOString()
  }).eq("id", id).eq("user_id", user.id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ invitation });
}
