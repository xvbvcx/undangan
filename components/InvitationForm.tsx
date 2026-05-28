"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "@/components/PhotoUploader";
import { emptyInvitationData, type InvitationData, type InvitationRecord, type TemplateMeta } from "@/lib/types";
import { makeSlug } from "@/lib/format";

export function InvitationForm({ template, initial }: { template: TemplateMeta; initial?: InvitationRecord }) {
  const router = useRouter();
  const [data, setData] = useState<InvitationData>(initial?.data || emptyInvitationData);
  const [slug, setSlug] = useState(initial?.slug || "");
  const [gallery, setGallery] = useState<string[]>(initial?.gallery_urls || []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const generatedSlug = useMemo(() => makeSlug(slug || `${data.groomNickname || data.groomName}-${data.brideNickname || data.brideName}`), [slug, data]);

  function update<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const endpoint = initial ? `/api/invitations/${initial.id}` : "/api/invitations";
    const response = await fetch(endpoint, {
      method: initial ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateSlug: template.slug, slug: generatedSlug, data, galleryUrls: gallery, isPublished: true })
    });
    const json = await response.json();
    setLoading(false);
    if (!response.ok) {
      setMessage(json.error || "Gagal menyimpan undangan");
      return;
    }
    router.push(template.tier === "premium" && json.invitation.payment_status !== "paid" ? `/dashboard?unlock=${json.invitation.id}` : `/u/${json.invitation.slug}`);
    router.refresh();
  }

  return (
    <form className="builder-shell" onSubmit={submit}>
      <aside className="builder-sidebar">
        <span className={`badge ${template.tier === "premium" ? "badge-premium" : "badge-free"}`}>{template.tier === "premium" ? "Premium Ultra" : "Gratis"}</span>
        <h1>{initial ? "Edit undangan" : "Buat undangan"}</h1>
        <p>Template: <strong>{template.name}</strong></p>
        <p className="muted">Foto maksimal 8: pasangan, pengantin, dan orang tua kedua belah pihak.</p>
        <div className="preview-link">Link: /u/{generatedSlug || "nama-pasangan"}</div>
        {template.tier === "premium" ? <div className="premium-note">Premium akan publish setelah pembayaran iPaymu berhasil atau custom manual via admin.</div> : null}
      </aside>

      <main className="builder-form">
        <section className="form-section">
          <h2>Data Pengantin</h2>
          <div className="form-grid two">
            <label>Nama lengkap pria<input value={data.groomName} onChange={(e) => update("groomName", e.target.value)} required /></label>
            <label>Nama panggilan pria<input value={data.groomNickname} onChange={(e) => update("groomNickname", e.target.value)} /></label>
            <label>Nama lengkap wanita<input value={data.brideName} onChange={(e) => update("brideName", e.target.value)} required /></label>
            <label>Nama panggilan wanita<input value={data.brideNickname} onChange={(e) => update("brideNickname", e.target.value)} /></label>
            <label>Ayah pengantin pria<input value={data.groomFather} onChange={(e) => update("groomFather", e.target.value)} /></label>
            <label>Ibu pengantin pria<input value={data.groomMother} onChange={(e) => update("groomMother", e.target.value)} /></label>
            <label>Ayah pengantin wanita<input value={data.brideFather} onChange={(e) => update("brideFather", e.target.value)} /></label>
            <label>Ibu pengantin wanita<input value={data.brideMother} onChange={(e) => update("brideMother", e.target.value)} /></label>
          </div>
        </section>

        <section className="form-section">
          <h2>Foto</h2>
          <PhotoUploader urls={gallery} onChange={setGallery} />
        </section>

        <section className="form-section">
          <h2>Akad / Pemberkatan</h2>
          <div className="form-grid two">
            <label>Tanggal<input type="date" value={data.akadDate} onChange={(e) => update("akadDate", e.target.value)} /></label>
            <label>Waktu<input value={data.akadTime} onChange={(e) => update("akadTime", e.target.value)} placeholder="08.00 WIB" /></label>
            <label>Tempat<input value={data.akadVenue} onChange={(e) => update("akadVenue", e.target.value)} /></label>
            <label>Alamat<input value={data.akadAddress} onChange={(e) => update("akadAddress", e.target.value)} /></label>
            <label className="full">Link Google Maps<input value={data.akadMaps} onChange={(e) => update("akadMaps", e.target.value)} /></label>
          </div>
        </section>

        <section className="form-section">
          <h2>Resepsi</h2>
          <div className="form-grid two">
            <label>Tanggal<input type="date" value={data.receptionDate} onChange={(e) => update("receptionDate", e.target.value)} /></label>
            <label>Waktu<input value={data.receptionTime} onChange={(e) => update("receptionTime", e.target.value)} placeholder="11.00 - 14.00 WIB" /></label>
            <label>Tempat<input value={data.receptionVenue} onChange={(e) => update("receptionVenue", e.target.value)} /></label>
            <label>Alamat<input value={data.receptionAddress} onChange={(e) => update("receptionAddress", e.target.value)} /></label>
            <label className="full">Link Google Maps<input value={data.receptionMaps} onChange={(e) => update("receptionMaps", e.target.value)} /></label>
          </div>
        </section>

        <section className="form-section">
          <h2>Konten & Musik</h2>
          <div className="form-grid">
            <label>Quote<textarea value={data.quote} onChange={(e) => update("quote", e.target.value)} rows={3} /></label>
            <label>Kalimat pembuka<textarea value={data.openingText} onChange={(e) => update("openingText", e.target.value)} rows={3} /></label>
            <label>Judul cerita<input value={data.storyTitle} onChange={(e) => update("storyTitle", e.target.value)} /></label>
            <label>Love story<textarea value={data.story} onChange={(e) => update("story", e.target.value)} rows={4} /></label>
            <label>Backsound
              <select value={data.musicUrl} onChange={(e) => update("musicUrl", e.target.value)}>
                <option value="/audio/soft-wedding-chime.wav">Soft Wedding Chime</option>
                <option value="/audio/royal-opening-chime.wav">Royal Opening Chime</option>
                <option value="/audio/garden-love-chime.wav">Garden Love Chime</option>
                <option value="">Tanpa musik</option>
              </select>
            </label>
            <label>Custom music URL<input value={data.musicUrl.startsWith("/audio") ? "" : data.musicUrl} onChange={(e) => update("musicUrl", e.target.value)} placeholder="https://...mp3" /></label>
          </div>
        </section>

        <section className="form-section">
          <h2>Kado Digital</h2>
          <div className="form-grid three">
            <label>Bank/e-wallet<input value={data.giftBank} onChange={(e) => update("giftBank", e.target.value)} /></label>
            <label>No rekening<input value={data.giftAccount} onChange={(e) => update("giftAccount", e.target.value)} /></label>
            <label>Atas nama<input value={data.giftName} onChange={(e) => update("giftName", e.target.value)} /></label>
          </div>
        </section>

        {message ? <div className="alert">{message}</div> : null}
        <div className="sticky-actions">
          <button className="button gold wide" disabled={loading}>{loading ? "Menyimpan..." : initial ? "Simpan perubahan" : "Publish undangan"}</button>
        </div>
      </main>
    </form>
  );
}
