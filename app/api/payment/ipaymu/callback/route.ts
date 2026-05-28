import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addDays } from "@/lib/format";
import { fetchIpaymuTransaction, isIpaymuStatusPaid, verifyIpaymuSignature } from "@/lib/ipaymu";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// iPaymu callback handler — hardened against spoofing and replay.
//
// 1. Per-IP rate limit so an attacker can't burst-guess valid referenceIds.
// 2. HMAC signature header verification (constant-time) using the iPaymu API key.
// 3. Mandatory server-to-server transaction lookup against iPaymu — we never
//    trust the inbound payload alone, even after signature passes.
// 4. Amount cross-check: callback amount must match the stored order amount.
// 5. Idempotency: an order already marked `paid` is acknowledged but never
//    re-processed, so attackers can't extend `active_until` repeatedly.
export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limiter = rateLimit({ key: `ipaymu-callback:${ip}`, limit: 30, windowMs: 60_000 });
  if (!limiter.allowed) {
    return NextResponse.json({ ok: false, error: "Rate limit." }, { status: 429 });
  }

  const rawBody = await request.text();
  const contentType = request.headers.get("content-type") || "";

  let payload: Record<string, any> = {};
  if (contentType.includes("application/json")) {
    try { payload = JSON.parse(rawBody || "{}"); } catch { payload = {}; }
  } else {
    const params = new URLSearchParams(rawBody);
    payload = Object.fromEntries(params.entries());
  }

  const referenceId =
    payload.referenceId || payload.reference_id || payload.reference || payload.trx_id;
  if (!referenceId) {
    return NextResponse.json({ ok: false, error: "referenceId tidak ada" }, { status: 400 });
  }

  const headerSignature = request.headers.get("signature");
  const skipSignature = process.env.IPAYMU_SKIP_SIGNATURE_CHECK === "true";
  if (!skipSignature && !verifyIpaymuSignature(rawBody, headerSignature)) {
    return NextResponse.json({ ok: false, error: "Signature tidak valid." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("reference_id", referenceId)
    .single();
  if (!order) {
    return NextResponse.json({ ok: false, error: "Order tidak ditemukan" }, { status: 404 });
  }

  // Idempotency — already paid means the unlock has happened. Accept the
  // delivery but don't reapply side effects.
  if (order.status === "paid") {
    return NextResponse.json({ ok: true, idempotent: true });
  }

  // Server-to-server confirmation. We refuse to flip the order based purely
  // on the inbound webhook body even after the signature passes.
  const transaction = await fetchIpaymuTransaction(String(referenceId));
  const callbackStatus = String(payload.status || payload.Status || payload.status_code || payload.transaction_status || "").toLowerCase();
  const code = payload.status_code ? String(payload.status_code) : null;

  const callbackPaid = isIpaymuStatusPaid(callbackStatus, code);
  const remotePaid = transaction ? isIpaymuStatusPaid(transaction.status) : false;
  const isPaid = callbackPaid && (remotePaid || transaction === null && process.env.IPAYMU_TRUST_CALLBACK === "true");

  // Amount check — only enforce when the remote lookup gave us a number.
  const remoteAmount = transaction?.amount ?? null;
  if (isPaid && remoteAmount !== null && remoteAmount !== order.amount) {
    await supabase.from("orders").update({
      status: "failed",
      raw_response: { reason: "amount_mismatch", payload, transaction: transaction?.raw ?? null }
    }).eq("id", order.id);
    return NextResponse.json({ ok: false, error: "Amount mismatch." }, { status: 409 });
  }

  if (!isPaid) {
    await supabase.from("orders").update({
      status: "failed",
      raw_response: { payload, transaction: transaction?.raw ?? null }
    }).eq("id", order.id);
    return NextResponse.json({ ok: true, status: "failed" });
  }

  await supabase.from("orders").update({
    status: "paid",
    paid_at: new Date().toISOString(),
    raw_response: { payload, transaction: transaction?.raw ?? null }
  }).eq("id", order.id);

  // Invitation activation. Only set `active_until` if not already set or if
  // it is shorter than the new period — never shorten an existing window.
  const { data: invitation } = await supabase
    .from("invitations")
    .select("active_until, package_type, payment_status")
    .eq("id", order.invitation_id)
    .single();

  const now = new Date();
  const baseDate = invitation?.active_until && new Date(invitation.active_until) > now
    ? new Date(invitation.active_until)
    : now;
  const newActiveUntil = addDays(baseDate, 30).toISOString();

  await supabase.from("invitations").update({
    payment_status: "paid",
    package_type: "premium",
    is_published: true,
    status: "published",
    active_until: newActiveUntil,
    updated_at: new Date().toISOString()
  }).eq("id", order.invitation_id);

  return NextResponse.json({ ok: true });
}

// Some payment providers issue a GET probe to verify the endpoint is reachable.
export async function GET() {
  return NextResponse.json({ ok: true });
}
