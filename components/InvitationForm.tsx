"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploader } from "@/components/PhotoUploader";
import { emptyInvitationData, type InvitationData, type InvitationRecord, type TemplateMeta } from "@/lib/types";
import { makeSlug } from "@/lib/format";
import { slugReason } from "@/lib/sanitize";
import { useToast } from "@/components/Toast";

const STEPS = [
  { id: "couple", label: "Pengantin" },
  { id: "media", label: "Foto" },
  { id: "events", label: "Acara" },
  { id: "story", label: "Cerita" },
  { id: "gift", label: "Kado" },
  { id: "publish", label: "Publish" }
] as const;

type StepId = (typeof STEPS)[number]["id"];

type Props = { template: TemplateMeta; initial?: InvitationRecord };

export function InvitationForm({ template, initial }: Props) {
  const router = useRouter();
  const toast = useToast();

  const [data, setData] = useState<InvitationData>({ ...emptyInvitationData, ...(initial?.data ?? {}) });
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));
  const [gallery, setGallery] = useState<string[]>(initial?.gallery_urls || []);
  const [isPublished, setIsPublished] = useState(initial ? initial.is_published : true);
  const [step, setStep] = useState<StepId>("couple");
  const [loading, setLoading] = useState(false);

  const generatedSlug = useMemo(
    () => makeSlug(slug || `${data.groomNickname || data.groomName}-${data.brideNickname || data.brideName}`),
    [slug, data.groomNickname, data.groomName, data.brideNickname, data.brideName]
  );

  const slugError = useMemo(() => slugReason(generatedSlug), [generatedSlug]);

  function update<K extends keyof InvitationData>(key: K, value: InvitationData[K]) {
    setData((current) => ({ ...current, [key]: value }));
  }

  // Auto-derive slug from couple names until the user explicitly edits it.
  useEffect(() => {
    if (slugTouched) return;
    setSlug(generatedSlug);
  }, [generatedSlug, slugTouched]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (slugError) {
      toast.push(slugError, "error");
      return;
    }
    if (!data.groomName.trim() || !data.brideName.trim()) {
      toast.push("Nama kedua pengantin wajib diisi.", "error");
      setStep("couple");
      return;
    }

    setLoading(true);
    try {
      const endpoint = initial ? `/api/invitations/${initial.id}` : "/api/invitations";
      const response = await fetch(endpoint, {
        method: initial ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateSlug: template.slug,
          slug: generatedSlug,
          data,
          galleryUrls: gallery,
          isPublished
        })
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Gagal menyimpan undangan.", "error");
        return;
      }
      toast.push(initial ? "Undangan tersimpan." : "Undangan dibuat.", "success");

      const next = `/u/${json.invitation.slug}`;
      router.push(next);
      router.refresh();
    } catch {
      toast.push("Network error.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="builder-shell" onSubmit={submit}>
      <aside className="builder-sidebar">
        <span className="badge badge-premium">Ultra Premium Gratis</span>
        <h1>{initial ? "Edit undangan" : "Buat undangan"}</h1>
        <p>Template: <strong>{template.name}</strong></p>
        <p className="muted">Foto maksimal 8: pasangan, pengantin, dan orang tua kedua belah pihak.</p>
        <p className="muted">Backsound diatur otomatis sesuai template (admin yang memilih). Kamu tidak perlu input URL musik.</p>

        <label className="slug-field">
          Slug undangan
          <input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setSlugTouched(true); }}
            placeholder="nama-pasangan"
            maxLength={64}
          />
          <div className={`preview-link ${slugError ? "error" : ""}`}>Link: /u/{generatedSlug || "nama-pasangan"}</div>
          {slugError ? <small className="alert">{slugError}</small> : null}
        </label>

        <ol className="builder-steps">
          {STEPS.map((s, index) => (
            <li key={s.id} className={s.id === step ? "active" : ""}>
              <button type="button" onClick={() => setStep(s.id)}>
                <strong>{index + 1}</strong>
                <span>{s.label}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="premium-note">Semua template ultra premium — 100% gratis, tanpa batasan.</div>
      </aside>

      <main className="builder-form">
        {step === "couple" ? (
          <section className="form-section" aria-labelledby="step-couple">
            <h2 id="step-couple">Data Pengantin</h2>
            <div className="form-grid two">
              <label>Nama lengkap pria<input value={data.groomName} onChange={(e) => update("groomName", e.target.value)} required maxLength={80} /></label>
              <label>Nama panggilan pria<input value={data.groomNickname} onChange={(e) => update("groomNickname", e.target.value)} maxLength={40} /></label>
              <label>Nama lengkap wanita<input value={data.brideName} onChange={(e) => update("brideName", e.target.value)} required maxLength={80} /></label>
              <label>Nama panggilan wanita<input value={data.brideNickname} onChange={(e) => update("brideNickname", e.target.value)} maxLength={40} /></label>
              <label>Ayah pengantin pria<input value={data.groomFather} onChange={(e) => update("groomFather", e.target.value)} maxLength={80} /></label>
              <label>Ibu pengantin pria<input value={data.groomMother} onChange={(e) => update("groomMother", e.target.value)} maxLength={80} /></label>
              <label>Ayah pengantin wanita<input value={data.brideFather} onChange={(e) => update("brideFather", e.target.value)} maxLength={80} /></label>
              <label>Ibu pengantin wanita<input value={data.brideMother} onChange={(e) => update("brideMother", e.target.value)} maxLength={80} /></label>
            </div>
          </section>
        ) : null}

        {step === "media" ? (
          <section className="form-section" aria-labelledby="step-media">
            <h2 id="step-media">Foto</h2>
            <PhotoUploader urls={gallery} onChange={setGallery} />
          </section>
        ) : null}

        {step === "events" ? (
          <>
            <section className="form-section">
              <h2>Akad / Pemberkatan</h2>
              <div className="form-grid two">
                <label>Tanggal<input type="date" value={data.akadDate} onChange={(e) => update("akadDate", e.target.value)} /></label>
                <label>Waktu<input value={data.akadTime} onChange={(e) => update("akadTime", e.target.value)} placeholder="08.00 WIB" maxLength={40} /></label>
                <label>Tempat<input value={data.akadVenue} onChange={(e) => update("akadVenue", e.target.value)} maxLength={160} /></label>
                <label>Alamat<input value={data.akadAddress} onChange={(e) => update("akadAddress", e.target.value)} maxLength={280} /></label>
                <label className="full">
                  Link Google Maps
                  <input type="url" value={data.akadMaps} onChange={(e) => update("akadMaps", e.target.value)} placeholder="https://maps.google.com/..." pattern="https?://.*" />
                </label>
              </div>
            </section>
            <section className="form-section">
              <h2>Resepsi</h2>
              <div className="form-grid two">
                <label>Tanggal<input type="date" value={data.receptionDate} onChange={(e) => update("receptionDate", e.target.value)} /></label>
                <label>Waktu<input value={data.receptionTime} onChange={(e) => update("receptionTime", e.target.value)} placeholder="11.00 - 14.00 WIB" maxLength={80} /></label>
                <label>Tempat<input value={data.receptionVenue} onChange={(e) => update("receptionVenue", e.target.value)} maxLength={160} /></label>
                <label>Alamat<input value={data.receptionAddress} onChange={(e) => update("receptionAddress", e.target.value)} maxLength={280} /></label>
                <label className="full">
                  Link Google Maps
                  <input type="url" value={data.receptionMaps} onChange={(e) => update("receptionMaps", e.target.value)} placeholder="https://maps.google.com/..." pattern="https?://.*" />
                </label>
              </div>
            </section>
          </>
        ) : null}

        {step === "story" ? (
          <section className="form-section">
            <h2>Konten</h2>
            <div className="form-grid">
              <label>Quote<textarea value={data.quote} onChange={(e) => update("quote", e.target.value)} rows={3} maxLength={600} /></label>
              <label>Kalimat pembuka<textarea value={data.openingText} onChange={(e) => update("openingText", e.target.value)} rows={3} maxLength={800} /></label>
              <label>Judul cerita<input value={data.storyTitle} onChange={(e) => update("storyTitle", e.target.value)} maxLength={80} /></label>
              <label>Love story<textarea value={data.story} onChange={(e) => update("story", e.target.value)} rows={4} maxLength={2000} /></label>
            </div>
            <p className="muted">Backsound: ditentukan oleh template &amp; admin. Untuk mengubah musik, hubungi admin.</p>
          </section>
        ) : null}

        {step === "gift" ? (
          <section className="form-section">
            <h2>Kado Digital</h2>
            <div className="form-grid three">
              <label>Bank/e-wallet<input value={data.giftBank} onChange={(e) => update("giftBank", e.target.value)} maxLength={80} /></label>
              <label>No rekening<input value={data.giftAccount} onChange={(e) => update("giftAccount", e.target.value)} maxLength={80} /></label>
              <label>Atas nama<input value={data.giftName} onChange={(e) => update("giftName", e.target.value)} maxLength={80} /></label>
            </div>
            <label className="full">
              QRIS image URL (opsional)
              <input type="url" value={data.giftQris} onChange={(e) => update("giftQris", e.target.value)} placeholder="https://...qris.png" pattern="https?://.*" />
              <small className="muted">Tempel URL gambar QRIS yang sudah kamu hosting.</small>
            </label>
          </section>
        ) : null}

        {step === "publish" ? (
          <section className="form-section">
            <h2>Publish</h2>
            <p className="muted">Centang untuk mempublish undangan. Kalau dimatikan, undangan disimpan sebagai draft dan link publik tidak akan bisa dibuka.</p>
            <label className="checkbox-row">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              <span>Publish undangan</span>
            </label>
            <div className="muted" style={{ marginTop: 12 }}>
              Status sekarang: <strong>{isPublished ? "Akan di-publish" : "Draft"}</strong>
              {null}
            </div>
          </section>
        ) : null}

        <div className="sticky-actions">
          <button
            type="button"
            className="button ghost"
            onClick={() => {
              const idx = STEPS.findIndex((s) => s.id === step);
              if (idx > 0) setStep(STEPS[idx - 1]!.id);
            }}
            disabled={STEPS[0].id === step || loading}
          >
            ← Sebelumnya
          </button>
          {step !== "publish" ? (
            <button
              type="button"
              className="button gold"
              onClick={() => {
                const idx = STEPS.findIndex((s) => s.id === step);
                if (idx >= 0 && idx < STEPS.length - 1) setStep(STEPS[idx + 1]!.id);
              }}
            >
              Lanjut →
            </button>
          ) : (
            <button type="submit" className="button gold wide" disabled={loading || !!slugError}>
              {loading ? "Menyimpan..." : initial ? "Simpan perubahan" : (isPublished ? "Publish undangan" : "Simpan draft")}
            </button>
          )}
        </div>
      </main>
    </form>
  );
}
