import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { InvitationCardActions } from "@/components/InvitationCardActions";
import { createClient } from "@/lib/supabase/server";
import { templates, templatePrice } from "@/lib/templates";
import { formatRupiah } from "@/lib/format";
import type { InvitationRecord, OrderRecord } from "@/lib/types";

type DashboardSearchParams = Record<string, string | string[] | undefined>;

export default async function DashboardPage({ searchParams }: { searchParams: Promise<DashboardSearchParams> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, role")
    .eq("id", user.id)
    .single();

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<InvitationRecord[]>();
  const list = invitations ?? [];

  const invitationIds = list.map((inv) => inv.id);
  const [{ data: rsvps }, { data: guestbook }, { data: pendingOrders }] = await Promise.all([
    invitationIds.length
      ? supabase.from("rsvps").select("invitation_id, attendance, guest_count").in("invitation_id", invitationIds)
      : Promise.resolve({ data: [] as { invitation_id: string; attendance: string; guest_count: number }[] }),
    invitationIds.length
      ? supabase.from("guestbook").select("invitation_id").in("invitation_id", invitationIds)
      : Promise.resolve({ data: [] as { invitation_id: string }[] }),
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .returns<OrderRecord[]>()
  ]);

  // Aggregate counts per invitation so we can render quick stats.
  const stats = new Map<string, { rsvp: number; guests: number; ucapan: number }>();
  for (const id of invitationIds) stats.set(id, { rsvp: 0, guests: 0, ucapan: 0 });
  for (const row of rsvps ?? []) {
    const entry = stats.get(row.invitation_id);
    if (!entry) continue;
    entry.rsvp += 1;
    if (row.attendance === "hadir") entry.guests += row.guest_count ?? 1;
  }
  for (const row of guestbook ?? []) {
    const entry = stats.get(row.invitation_id);
    if (!entry) continue;
    entry.ucapan += 1;
  }

  const totalRsvp = (rsvps ?? []).length;
  const totalUcapan = (guestbook ?? []).length;
  const totalViews = list.reduce((sum, inv) => sum + (inv.view_count ?? 0), 0);

  const sp = await searchParams;
  const unlockId = typeof sp.unlock === "string" ? sp.unlock : null;
  const adminWhatsapp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "6281234567890";

  return (
    <main className="dashboard-page">
      <div className="dash-topbar">
        <Link href="/" className="brand-mark"><span className="brand-orb">NK</span><strong>Nikah Kilat</strong></Link>
        <div className="dash-actions">
          {profile?.role === "admin" ? <Link href="/admin" className="button ghost">Admin</Link> : null}
          <Link href="/templates-page" className="button ghost">Pilih template</Link>
          <LogoutButton />
        </div>
      </div>

      <section className="dash-hero">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>Halo{profile?.username ? `, ${profile.username}` : ""}.</h1>
          <p>Edit undangan, pantau RSVP, ucapan, dan view counter.</p>
        </div>
        <div className="dash-stats-row">
          <div className="dash-stat"><strong>{list.length}</strong><span>Undangan</span></div>
          <div className="dash-stat"><strong>{totalViews}</strong><span>Views</span></div>
          <div className="dash-stat"><strong>{totalRsvp}</strong><span>RSVP</span></div>
          <div className="dash-stat"><strong>{totalUcapan}</strong><span>Ucapan</span></div>
        </div>
      </section>

      {pendingOrders && pendingOrders.length > 0 ? (
        <section className="pending-orders" aria-label="Order menunggu pembayaran">
          {pendingOrders.map((order) => (
            <article key={order.id} className="pending-order">
              <div>
                <strong>Order menunggu pembayaran</strong>
                <p className="muted">Reference: {order.reference_id} • {formatRupiah(order.amount)}</p>
              </div>
              {order.payment_url ? (
                <a className="button gold" href={order.payment_url} target="_blank" rel="noopener noreferrer">Lanjutkan bayar</a>
              ) : null}
            </article>
          ))}
        </section>
      ) : null}

      <section className="dash-grid">
        {list.length ? list.map((inv) => {
          const template = templates.find((t) => t.slug === inv.template_slug);
          const needsPayment = inv.template_tier === "premium" && inv.payment_status !== "paid";
          const stat = stats.get(inv.id) ?? { rsvp: 0, guests: 0, ucapan: 0 };
          const isUnlockTarget = unlockId === inv.id;
          return (
            <article key={inv.id} className={`dash-card ${isUnlockTarget ? "highlight" : ""}`}>
              <div className="split">
                <span className={`badge ${inv.template_tier === "premium" ? "badge-premium" : "badge-free"}`}>
                  {inv.template_tier === "premium" ? "Premium" : "Gratis"}
                </span>
                <span className="muted">{inv.payment_status}</span>
              </div>
              <h2>{inv.data?.groomNickname || inv.data?.groomName || "Pengantin"} &amp; {inv.data?.brideNickname || inv.data?.brideName || "Pasangan"}</h2>
              <p className="muted">Template: {template?.name || inv.template_slug}</p>
              <p className="muted">
                Aktif sampai: {inv.active_until ? new Date(inv.active_until).toLocaleDateString("id-ID", { dateStyle: "medium" }) : "—"}
              </p>

              <div className="card-mini-stats">
                <span><strong>{inv.view_count ?? 0}</strong> views</span>
                <span><strong>{stat.rsvp}</strong> RSVP</span>
                <span><strong>{stat.guests}</strong> tamu</span>
                <span><strong>{stat.ucapan}</strong> ucapan</span>
              </div>

              {needsPayment ? (
                <div className="unlock-box">
                  <strong>Unlock Premium Ultra Exclusive</strong>
                  <p>{formatRupiah(templatePrice())} • no watermark • masa aktif 30 hari.</p>
                  <form action="/api/payment/ipaymu" method="POST">
                    <input type="hidden" name="invitationId" value={inv.id} />
                    <button className="button gold wide">Bayar otomatis iPaymu</button>
                  </form>
                  <a
                    className="button ghost wide"
                    href={`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(`Halo admin Nikah Kilat, saya mau custom manual untuk undangan ${inv.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Custom manual via admin
                  </a>
                </div>
              ) : null}

              <InvitationCardActions invitation={inv} />
            </article>
          );
        }) : (
          <div className="empty-state">
            <h2>Belum ada undangan.</h2>
            <p>Pilih template gratis atau premium untuk mulai.</p>
            <Link href="/" className="button gold">Pilih template</Link>
          </div>
        )}
      </section>

      {list.length > 0 ? <DashboardRsvpList userId={user.id} /> : null}
    </main>
  );
}

async function DashboardRsvpList({ userId }: { userId: string }) {
  const supabase = await createClient();

  const { data: invitationRows } = await supabase
    .from("invitations")
    .select("id, slug, data")
    .eq("user_id", userId)
    .returns<{ id: string; slug: string; data: { groomNickname?: string; brideNickname?: string } }[]>();
  const invitationIds = (invitationRows ?? []).map((row) => row.id);
  if (!invitationIds.length) return null;

  const slugLookup = new Map((invitationRows ?? []).map((row) => [row.id, row]));

  const [{ data: recentRsvps }, { data: recentMessages }] = await Promise.all([
    supabase
      .from("rsvps")
      .select("id, invitation_id, guest_name, attendance, guest_count, message, created_at")
      .in("invitation_id", invitationIds)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("guestbook")
      .select("id, invitation_id, name, message, created_at")
      .in("invitation_id", invitationIds)
      .order("created_at", { ascending: false })
      .limit(20)
  ]);

  return (
    <section className="dash-feedback">
      <div className="feedback-block">
        <h2>RSVP terbaru</h2>
        {recentRsvps && recentRsvps.length ? (
          <ul>
            {recentRsvps.map((entry) => {
              const inv = slugLookup.get(entry.invitation_id);
              return (
                <li key={entry.id}>
                  <strong>{entry.guest_name}</strong>
                  <span className={`badge attendance-${entry.attendance}`}>{entry.attendance.replace("_", " ")}</span>
                  <small>{entry.guest_count} tamu • {new Date(entry.created_at).toLocaleDateString("id-ID")} • untuk {inv?.slug ?? "—"}</small>
                  {entry.message ? <p>{entry.message}</p> : null}
                </li>
              );
            })}
          </ul>
        ) : <p className="muted">Belum ada RSVP.</p>}
      </div>

      <div className="feedback-block">
        <h2>Ucapan terbaru</h2>
        {recentMessages && recentMessages.length ? (
          <ul>
            {recentMessages.map((entry) => {
              const inv = slugLookup.get(entry.invitation_id);
              return (
                <li key={entry.id}>
                  <strong>{entry.name}</strong>
                  <small>{new Date(entry.created_at).toLocaleDateString("id-ID")} • untuk {inv?.slug ?? "—"}</small>
                  <p>{entry.message}</p>
                </li>
              );
            })}
          </ul>
        ) : <p className="muted">Belum ada ucapan.</p>}
      </div>
    </section>
  );
}
