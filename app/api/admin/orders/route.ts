import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { adminOrderActionSchema, reasonFromZod } from "@/lib/validators";
import { addDays } from "@/lib/format";

export async function POST(request: Request) {
  let admin;
  try { admin = await requireAdmin(); } catch (err) { if (err instanceof Response) return err; throw err; }

  const parsed = adminOrderActionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: reasonFromZod(parsed.error) }, { status: 400 });

  const supabase = createAdminClient();
  const { data: order } = await supabase.from("orders").select("*").eq("id", parsed.data.orderId).single();
  if (!order) return NextResponse.json({ error: "Order tidak ditemukan." }, { status: 404 });

  if (parsed.data.action === "mark_paid") {
    if (order.status === "paid") return NextResponse.json({ ok: true, idempotent: true });
    await supabase.from("orders").update({
      status: "paid",
      paid_at: new Date().toISOString(),
      raw_response: { ...(order.raw_response ?? {}), manual_admin: { actor_id: admin.id } }
    }).eq("id", order.id);

    const { data: invitation } = await supabase
      .from("invitations")
      .select("active_until")
      .eq("id", order.invitation_id)
      .single();
    const now = new Date();
    const base = invitation?.active_until && new Date(invitation.active_until) > now
      ? new Date(invitation.active_until)
      : now;
    await supabase.from("invitations").update({
      payment_status: "paid",
      package_type: "premium",
      is_published: true,
      status: "published",
      active_until: addDays(base, 30).toISOString(),
      updated_at: new Date().toISOString()
    }).eq("id", order.invitation_id);
  } else if (parsed.data.action === "mark_failed") {
    await supabase.from("orders").update({ status: "failed" }).eq("id", order.id);
  } else if (parsed.data.action === "refund") {
    await supabase.from("orders").update({ status: "refunded" }).eq("id", order.id);
    await supabase.from("invitations").update({
      payment_status: "expired",
      package_type: "free",
      is_published: false,
      status: "archived"
    }).eq("id", order.invitation_id);
  }

  await supabase.from("audit_logs").insert({
    actor_id: admin.id,
    action: `order.${parsed.data.action}`,
    target_type: "order",
    target_id: order.id
  });

  return NextResponse.json({ ok: true });
}
