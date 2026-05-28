import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminInvitationActions, AdminOrderActions, AdminProfileActions } from "@/components/AdminActions";
import type { InvitationRecord, OrderRecord, ProfileRecord } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/admin");

  const { data: profile } = await supabase.from("profiles").select("role, username").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [
    { data: invitations },
    { data: orders },
    { data: profiles },
    { data: auditLogs }
  ] = await Promise.all([
    supabase
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(80)
      .returns<InvitationRecord[]>(),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(80)
      .returns<OrderRecord[]>(),
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(80)
      .returns<ProfileRecord[]>(),
    supabase
      .from("audit_logs")
      .select("id, action, target_type, target_id, created_at, actor_id")
      .order("created_at", { ascending: false })
      .limit(40)
  ]);

  const invitationList = invitations ?? [];
  const orderList = orders ?? [];
  const profileList = profiles ?? [];

  const paidInvitations = invitationList.filter((i) => i.payment_status === "paid").length;
  const totalRevenue = orderList
    .filter((order) => order.status === "paid")
    .reduce((sum, order) => sum + order.amount, 0);

  return (
    <main className="dashboard-page">
      <div className="dash-topbar">
        <Link href="/" className="brand-mark"><span className="brand-orb">NK</span><strong>Admin Nikah Kilat</strong></Link>
        <Link href="/dashboard" className="button ghost">Dashboard user</Link>
      </div>

      <section className="dash-hero admin-hero">
        <div>
          <span className="eyebrow">Admin dashboard</span>
          <h1>Monitoring undangan, order, dan unlock premium.</h1>
        </div>
        <div className="admin-stats">
          <div><strong>{invitationList.length}</strong><span>Undangan</span></div>
          <div><strong>{paidInvitations}</strong><span>Paid</span></div>
          <div><strong>{orderList.length}</strong><span>Order</span></div>
          <div><strong>{formatRupiah(totalRevenue)}</strong><span>Revenue</span></div>
        </div>
      </section>

      <section className="admin-table-section">
        <h2>Undangan terbaru</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Slug</th><th>Paket</th><th>Bayar</th><th>Publish</th><th>Aktif sampai</th><th>Dibuat</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {invitationList.map((inv) => (
                <tr key={inv.id}>
                  <td><Link href={`/u/${inv.slug}`} target="_blank">{inv.slug}</Link></td>
                  <td>{inv.package_type}</td>
                  <td>{inv.payment_status}</td>
                  <td>{inv.is_published ? "Ya" : "Tidak"}</td>
                  <td>{inv.active_until ? new Date(inv.active_until).toLocaleDateString("id-ID") : "—"}</td>
                  <td>{new Date(inv.created_at).toLocaleDateString("id-ID")}</td>
                  <td><AdminInvitationActions invitation={inv} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-table-section">
        <h2>Order terbaru</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Reference</th><th>Amount</th><th>Status</th><th>Provider</th><th>Dibuat</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {orderList.map((order) => (
                <tr key={order.id}>
                  <td>{order.reference_id}</td>
                  <td>{formatRupiah(order.amount)}</td>
                  <td>{order.status}</td>
                  <td>{order.payment_provider}</td>
                  <td>{new Date(order.created_at).toLocaleDateString("id-ID")}</td>
                  <td><AdminOrderActions order={order} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-table-section">
        <h2>User & role</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Email</th><th>Username</th><th>Role</th><th>Dibuat</th><th>Aksi</th></tr>
            </thead>
            <tbody>
              {profileList.map((p) => (
                <tr key={p.id}>
                  <td>{p.email ?? "—"}</td>
                  <td>{p.username ?? "—"}</td>
                  <td>{p.role}</td>
                  <td>{new Date(p.created_at).toLocaleDateString("id-ID")}</td>
                  <td><AdminProfileActions profile={p} currentUserId={user.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {auditLogs && auditLogs.length ? (
        <section className="admin-table-section">
          <h2>Audit log</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Action</th><th>Target</th><th>ID</th><th>Waktu</th></tr></thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.action}</td>
                    <td>{log.target_type ?? "—"}</td>
                    <td>{log.target_id ?? "—"}</td>
                    <td>{new Date(log.created_at).toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </main>
  );
}
