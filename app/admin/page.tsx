import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { InvitationRecord } from "@/lib/types";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role, username").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");
  const { data: invitations } = await supabase.from("invitations").select("*").order("created_at", { ascending: false }).limit(50).returns<InvitationRecord[]>();
  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50);
  const list = invitations || [];
  const paid = list.filter((i) => i.payment_status === "paid").length;
  return (
    <main className="dashboard-page">
      <div className="dash-topbar"><Link href="/" className="brand-mark"><span className="brand-orb">NK</span><strong>Admin Nikah Kilat</strong></Link><Link href="/dashboard" className="button ghost">Dashboard user</Link></div>
      <section className="dash-hero admin-hero"><div><span className="eyebrow">Admin dashboard</span><h1>Monitoring undangan, order, dan premium unlock.</h1></div><div className="admin-stats"><div><strong>{list.length}</strong><span>Total undangan</span></div><div><strong>{paid}</strong><span>Premium paid</span></div><div><strong>{orders?.length || 0}</strong><span>Order terbaru</span></div></div></section>
      <section className="admin-table-section"><h2>Undangan terbaru</h2><div className="table-wrap"><table><thead><tr><th>Slug</th><th>Paket</th><th>Status Bayar</th><th>Publish</th><th>Dibuat</th><th>Aksi</th></tr></thead><tbody>{list.map((inv) => <tr key={inv.id}><td>{inv.slug}</td><td>{inv.package_type}</td><td>{inv.payment_status}</td><td>{inv.is_published ? "Ya" : "Tidak"}</td><td>{new Date(inv.created_at).toLocaleDateString("id-ID")}</td><td><Link href={`/u/${inv.slug}`}>Lihat</Link></td></tr>)}</tbody></table></div></section>
      <section className="admin-table-section"><h2>Order terbaru</h2><div className="table-wrap"><table><thead><tr><th>Reference</th><th>Amount</th><th>Status</th><th>Provider</th><th>Dibuat</th></tr></thead><tbody>{(orders || []).map((order: any) => <tr key={order.id}><td>{order.reference_id}</td><td>{order.amount}</td><td>{order.status}</td><td>{order.payment_provider}</td><td>{new Date(order.created_at).toLocaleDateString("id-ID")}</td></tr>)}</tbody></table></div></section>
    </main>
  );
}
