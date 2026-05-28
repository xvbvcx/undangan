import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { guestbookSchema, reasonFromZod } from "@/lib/validators";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limiter = rateLimit({ key: `guestbook:${ip}`, limit: 6, windowMs: 60_000 });
  if (!limiter.allowed) {
    return NextResponse.json({ error: "Terlalu cepat, tunggu sebentar." }, { status: 429 });
  }

  const parsed = guestbookSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: invitation } = await supabase
    .from("invitations")
    .select("id, is_published, active_until")
    .eq("id", parsed.data.invitationId)
    .single();
  if (!invitation || !invitation.is_published) {
    return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  }
  if (invitation.active_until && new Date(invitation.active_until).getTime() < Date.now()) {
    return NextResponse.json({ error: "Undangan sudah tidak aktif." }, { status: 410 });
  }

  const { error } = await supabase.from("guestbook").insert({
    invitation_id: parsed.data.invitationId,
    name: parsed.data.name,
    message: parsed.data.message,
    client_ip: ip
  });
  if (error) return NextResponse.json({ error: "Gagal mengirim ucapan." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const invitationId = url.searchParams.get("invitationId");
  if (!invitationId) return NextResponse.json({ error: "invitationId wajib." }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("guestbook")
    .select("id, name, message, created_at")
    .eq("invitation_id", invitationId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) return NextResponse.json({ error: "Gagal memuat ucapan." }, { status: 400 });
  return NextResponse.json({ entries: data ?? [] });
}
