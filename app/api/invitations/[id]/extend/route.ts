import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createIpaymuRedirect } from "@/lib/ipaymu";
import { templatePrice } from "@/lib/templates";
import { addDays } from "@/lib/format";

// Owner extends the active period of an existing invitation. For free plans we
// bump the date directly. For premium we route through iPaymu the same way as
// the initial unlock.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const { data: invitation } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!invitation) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });

  const now = new Date();
  const baseDate = invitation.active_until && new Date(invitation.active_until) > now
    ? new Date(invitation.active_until)
    : now;
  const newActiveUntil = addDays(baseDate, 30).toISOString();

  if (invitation.template_tier !== "premium") {
    await supabase.from("invitations").update({
      active_until: newActiveUntil,
      is_published: true,
      status: "published",
      updated_at: new Date().toISOString()
    }).eq("id", invitation.id);
    return NextResponse.json({ ok: true, active_until: newActiveUntil });
  }

  // Premium → spawn an iPaymu redirect (same flow as unlock).
  const amount = templatePrice();
  const referenceId = `NK-EXT-${Date.now()}-${invitation.slug}`.slice(0, 80);
  const expiresAt = addDays(new Date(), 1).toISOString();
  const { data: order, error: orderError } = await supabase.from("orders").insert({
    user_id: user.id,
    invitation_id: invitation.id,
    amount,
    status: "pending",
    payment_provider: "ipaymu",
    reference_id: referenceId,
    expires_at: expiresAt
  }).select("*").single();
  if (orderError) return NextResponse.json({ error: "Gagal membuat order." }, { status: 400 });

  try {
    const redirectPayment = await createIpaymuRedirect({
      referenceId,
      amount,
      productName: "Nikah Kilat Premium Extend 30 Hari",
      buyerEmail: user.email || undefined,
      buyerName: invitation.data?.groomName || invitation.data?.brideName || "Pelanggan Nikah Kilat"
    });
    await supabase.from("orders").update({
      payment_url: redirectPayment.paymentUrl,
      raw_response: redirectPayment.raw
    }).eq("id", order.id);
    if (!redirectPayment.paymentUrl) {
      return NextResponse.json({ error: "iPaymu tidak mengembalikan URL pembayaran." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, paymentUrl: redirectPayment.paymentUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat pembayaran iPaymu.";
    await supabase.from("orders").update({ status: "failed", raw_response: { error: message } }).eq("id", order.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
