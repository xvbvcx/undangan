import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createIpaymuRedirect } from "@/lib/ipaymu";
import { templatePrice } from "@/lib/templates";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Harus login." }, { status: 401 });

  const contentType = request.headers.get("content-type") || "";
  const invitationId = contentType.includes("application/json")
    ? (await request.json()).invitationId
    : (await request.formData()).get("invitationId")?.toString();

  if (!invitationId) return NextResponse.json({ error: "Invitation ID wajib." }, { status: 400 });
  const { data: invitation, error } = await supabase.from("invitations").select("*").eq("id", invitationId).eq("user_id", user.id).single();
  if (error || !invitation) return NextResponse.json({ error: "Undangan tidak ditemukan." }, { status: 404 });
  if (invitation.payment_status === "paid") return NextResponse.redirect(new URL(`/u/${invitation.slug}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"), 303);

  const amount = templatePrice();
  const referenceId = `NK-${Date.now()}-${invitation.slug}`.slice(0, 80);
  const { data: order, error: orderError } = await supabase.from("orders").insert({
    user_id: user.id,
    invitation_id: invitation.id,
    amount,
    status: "pending",
    payment_provider: "ipaymu",
    reference_id: referenceId
  }).select("*").single();
  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 400 });

  try {
    const redirectPayment = await createIpaymuRedirect({
      referenceId,
      amount,
      productName: "Nikah Kilat Premium Ultra Exclusive",
      buyerEmail: user.email || undefined,
      buyerName: invitation.data?.groomName || invitation.data?.brideName || "Pelanggan Nikah Kilat"
    });
    await supabase.from("orders").update({ payment_url: redirectPayment.paymentUrl, raw_response: redirectPayment.raw }).eq("id", order.id);
    if (!redirectPayment.paymentUrl) return NextResponse.json({ error: "iPaymu tidak mengembalikan URL pembayaran.", raw: redirectPayment.raw }, { status: 502 });
    return NextResponse.redirect(redirectPayment.paymentUrl, 303);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Gagal membuat pembayaran iPaymu.";
    await supabase.from("orders").update({ status: "failed", raw_response: { error: message } }).eq("id", order.id);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
