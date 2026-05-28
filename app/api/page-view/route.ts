import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sanitizeText } from "@/lib/sanitize";

// Lightweight view counter pinger. Called from the public invitation page once
// after the gate is opened. RLS-bypassed via service role because anon can't
// write to page_views directly, and the increment_invitation_view RPC handles
// the counter atomically.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const body = await request.json().catch(() => null);
  const invitationId = typeof body?.invitationId === "string" ? body.invitationId : null;
  if (!invitationId) return NextResponse.json({ error: "invitationId wajib." }, { status: 400 });

  // 1 view per IP per invitation per 6 hours.
  const limiter = rateLimit({
    key: `view:${invitationId}:${ip}`,
    limit: 1,
    windowMs: 6 * 60 * 60 * 1000
  });
  if (!limiter.allowed) return NextResponse.json({ ok: true, deduped: true });

  const supabase = createAdminClient();
  const guestSlug = sanitizeText(body?.guestSlug ?? "", 80) || null;
  const userAgent = sanitizeText(request.headers.get("user-agent") ?? "", 240) || null;

  await supabase.from("page_views").insert({
    invitation_id: invitationId,
    guest_slug: guestSlug,
    user_agent: userAgent
  });
  await supabase.rpc("increment_invitation_view", { invitation_uuid: invitationId });
  return NextResponse.json({ ok: true });
}
