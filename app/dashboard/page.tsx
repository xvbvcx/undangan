import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { templates, templatePrice } from "@/lib/templates";
import { formatRupiah } from "@/lib/format";
import type { InvitationRecord } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: invitations } = await supabase.from("invitations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).returns<InvitationRecord[]>();
  const list = invitations || [];
  const adminWhatsapp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "6281234567890";
  return (
    <main className="dashboard-page">
      <div className="dash-topbar">
        <Link href="/" className="brand-mark"><span className="brand-orb">NK</span><strong>Nikah Kilat</strong></Link>
        <div className="dash-actions"><Link href="/#template" className="button ghost">Buat baru</Link><LogoutButton /></div>
      </div>
      <section className="dash-hero">
        <div><span className="eyebrow">Dashboard</span><h1>Kelola semua undangan kamu.</h1><p>Edit sebelum atau sesudah publish. Premium otomatis unlock setelah pembayaran sukses.</p></div>
        <div className="dash-stat"><strong>{list.length}</strong><span>undangan</span></div>
      </section>
      <section className="dash-grid">
        {list.length ? list.map((inv) => {
          const template = templates.find((t) => t.slug === inv.template_slug);
          const needsPayment = inv.template_tier === "premium" && inv.payment_status !== "paid";
          return (
            <article key={inv.id} className="dash-card">
              <div className="split"><span className={`badge ${inv.template_tier === "premium" ? "badge-premium" : "badge-free"}`}>{inv.template_tier === "premium" ? "Premium" : "Gratis"}</span><span className="muted">{inv.payment_status}</span></div>
              <h2>{inv.data?.groomNickname || inv.data?.groomName || "Pengantin"} & {inv.data?.brideNickname || inv.data?.brideName || "Pasangan"}</h2>
              <p>Template: {template?.name || inv.template_slug}</p>
              <p className="muted">Aktif sampai: {inv.active_until ? new Date(inv.active_until).toLocaleDateString("id-ID") : "setelah publish"}</p>
              {needsPayment ? (
                <div className="unlock-box">
                  <strong>Unlock Premium Ultra Exclusive</strong>
                  <p>{formatRupiah(templatePrice())} • no watermark • animasi premium • custom manual opsional.</p>
                  <form action="/api/payment/ipaymu" method="POST">
                    <input type="hidden" name="invitationId" value={inv.id} />
                    <button className="button gold wide">Bayar otomatis iPaymu</button>
                  </form>
                  <a className="button ghost wide" href={`https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(`Halo admin Nikah Kilat, saya mau custom manual untuk undangan ${inv.slug}`)}`} target="_blank">Custom manual via admin</a>
                </div>
              ) : null}
              <div className="card-actions"><Link href={`/edit/${inv.id}`} className="button ghost">Edit</Link><Link href={`/u/${inv.slug}`} className="button dark">Lihat</Link></div>
            </article>
          );
        }) : <div className="empty-state"><h2>Belum ada undangan.</h2><p>Pilih template gratis atau premium dari landing page.</p><Link href="/#template" className="button gold">Pilih template</Link></div>}
      </section>
    </main>
  );
}
