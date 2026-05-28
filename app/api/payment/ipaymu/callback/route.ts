import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { addDays } from "@/lib/format";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  const payload: Record<string, any> = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());

  const referenceId = payload.referenceId || payload.reference_id || payload.reference || payload.trx_id;
  const statusRaw = String(payload.status || payload.Status || payload.status_code || payload.transaction_status || "").toLowerCase();
  const isPaid = ["1", "paid", "berhasil", "success", "settlement"].includes(statusRaw) || statusRaw.includes("berhasil") || statusRaw.includes("success");

  if (!referenceId) return NextResponse.json({ ok: false, error: "referenceId tidak ada" }, { status: 400 });
  const supabase = createAdminClient();
  const { data: order } = await supabase.from("orders").select("*").eq("reference_id", referenceId).single();
  if (!order) return NextResponse.json({ ok: false, error: "Order tidak ditemukan" }, { status: 404 });

  await supabase.from("orders").update({ status: isPaid ? "paid" : "failed", raw_response: payload, paid_at: isPaid ? new Date().toISOString() : null }).eq("id", order.id);
  if (isPaid) {
    await supabase.from("invitations").update({
      payment_status: "paid",
      package_type: "premium",
      is_published: true,
      status: "published",
      active_until: addDays(new Date(), 30).toISOString(),
      updated_at: new Date().toISOString()
    }).eq("id", order.invitation_id);
  }
  return NextResponse.json({ ok: true });
}
