"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import type { GuestbookRecord } from "@/lib/types";
import { safeUrl } from "@/lib/sanitize";
import { formatDate } from "@/lib/format";

// Cross-layout building blocks. Every distinct layout in components/renderers/
// composes these so RSVP / guestbook / share / countdown / music behave
// identically regardless of the surrounding visual treatment.

export function Countdown({ target }: { target: string | undefined }) {
  const [parts, setParts] = useState(() => diff(target));

  useEffect(() => {
    if (!target) return;
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!parts) return null;
  return (
    <div className="countdown-card">
      <Slot label="Hari" value={parts.days} />
      <Slot label="Jam" value={parts.hours} />
      <Slot label="Menit" value={parts.minutes} />
      <Slot label="Detik" value={parts.seconds} />
    </div>
  );
}

function diff(target?: string) {
  if (!target) return null;
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return null;
  const ms = Math.max(0, date.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor((ms % 86_400_000) / 3_600_000),
    minutes: Math.floor((ms % 3_600_000) / 60_000),
    seconds: Math.floor((ms % 60_000) / 1000)
  };
}

function Slot({ label, value }: { label: string; value: number }) {
  return (
    <div className="countdown-slot">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

export function MusicToggle({ src }: { src: string | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  if (!src) return null;
  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.pause();
      setOn(false);
    } else {
      audio.play().then(() => setOn(true)).catch(() => setOn(false));
    }
  }
  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" aria-label="Backsound undangan" />
      <button
        type="button"
        onClick={toggle}
        className={`music-toggle ${on ? "on" : ""}`}
        aria-pressed={on}
        aria-label={on ? "Matikan musik" : "Putar musik"}
      >
        <span className="music-icon" aria-hidden>{on ? "❚❚" : "♪"}</span>
        <span className="sr-only">Musik</span>
      </button>
    </>
  );
}

export function EventCard({
  title, date, time, venue, address, maps
}: { title: string; date?: string; time?: string; venue?: string; address?: string; maps?: string }) {
  const safeMaps = safeUrl(maps);
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <strong>{formatDate(date)}</strong>
      <p>{time || "Waktu menyusul"}</p>
      <p>{venue || "Tempat menyusul"}</p>
      {address ? <small>{address}</small> : null}
      {safeMaps ? (
        <a className="button ghost" href={safeMaps} target="_blank" rel="noopener noreferrer">Buka Maps</a>
      ) : null}
    </div>
  );
}

export function GiftSection({
  giftBank, giftAccount, giftName, giftQris
}: { giftBank: string; giftAccount: string; giftName: string; giftQris: string }) {
  const toast = useToast();
  const safeQris = safeUrl(giftQris);
  function copy() {
    if (!giftAccount) return;
    navigator.clipboard.writeText(giftAccount).then(
      () => toast.push("Nomor rekening disalin.", "success"),
      () => toast.push("Gagal menyalin.", "error")
    );
  }
  if (!giftBank && !giftAccount && !safeQris) return null;
  return (
    <section className="invite-section gift-section">
      <span className="eyebrow">Kado Digital</span>
      <h2>Wedding Gift</h2>
      <div className="gift-card">
        {giftBank ? <strong>{giftBank}</strong> : null}
        {giftAccount ? (
          <button type="button" className="gift-account" onClick={copy} aria-label="Salin nomor rekening">
            <span>{giftAccount}</span>
            <small>Klik untuk salin</small>
          </button>
        ) : null}
        {giftName ? <small>a.n. {giftName}</small> : null}
        {safeQris ? (
          <Image src={safeQris} alt="QRIS kado digital" width={240} height={240} className="gift-qris" />
        ) : null}
      </div>
    </section>
  );
}

export function RsvpSection({
  invitationId, preview, guestName, guestSlug
}: { invitationId?: string; preview?: boolean; guestName?: string; guestSlug?: string }) {
  const toast = useToast();
  const [name, setName] = useState(guestName ?? "");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir" | "ragu">("hadir");
  const [guestCount, setGuestCount] = useState(1);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!invitationId) return null;
  const resolvedId = invitationId;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview) {
      toast.push("Mode preview — RSVP tidak dikirim.", "info");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: resolvedId, name, message, attendance, guestCount, guestSlug })
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Gagal mengirim RSVP.", "error");
        return;
      }
      setSent(true);
      toast.push("RSVP terkirim. Terima kasih.", "success");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="invite-section rsvp-section" id="rsvp">
      <span className="eyebrow">RSVP</span>
      <h2>Konfirmasi Kehadiran</h2>
      {sent ? (
        <div className="success-box">
          Terima kasih, RSVP kamu sudah tercatat.
          <button type="button" className="button ghost" onClick={() => setSent(false)}>Kirim ulang</button>
        </div>
      ) : (
        <form className="rsvp-form" onSubmit={submit}>
          <label>
            Nama
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required placeholder="Nama kamu" />
          </label>
          <label>
            Kehadiran
            <select value={attendance} onChange={(e) => setAttendance(e.target.value as typeof attendance)}>
              <option value="hadir">Hadir</option>
              <option value="tidak_hadir">Tidak hadir</option>
              <option value="ragu">Masih ragu</option>
            </select>
          </label>
          <label>
            Jumlah tamu
            <input type="number" min={1} max={20} value={guestCount} onChange={(e) => setGuestCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
          </label>
          <label>
            Pesan / doa
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={800} rows={3} placeholder="Tulis doa/ucapan" />
          </label>
          <button type="submit" className="button gold" disabled={loading}>{loading ? "Mengirim..." : "Kirim RSVP"}</button>
        </form>
      )}
    </section>
  );
}

export function GuestbookSection({ invitationId, preview }: { invitationId?: string; preview?: boolean }) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<GuestbookRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!invitationId || preview) return;
    let cancelled = false;
    fetch(`/api/guestbook?invitationId=${invitationId}`)
      .then((r) => r.json())
      .then((json) => { if (!cancelled && Array.isArray(json.entries)) setEntries(json.entries); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [invitationId, preview]);

  if (!invitationId) return null;
  const resolvedId = invitationId;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (preview) {
      toast.push("Mode preview — ucapan tidak dikirim.", "info");
      return;
    }
    if (!name.trim() || !message.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: resolvedId, name, message })
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.push(json.error || "Gagal mengirim ucapan.", "error");
        return;
      }
      const optimistic: GuestbookRecord = {
        id: crypto.randomUUID(),
        invitation_id: resolvedId,
        name,
        message,
        is_approved: true,
        created_at: new Date().toISOString()
      };
      setEntries((current) => [optimistic, ...current]);
      setName("");
      setMessage("");
      toast.push("Ucapan terkirim.", "success");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="invite-section guestbook-section" id="guestbook">
      <span className="eyebrow">Buku Tamu</span>
      <h2>Ucapan & Doa</h2>
      <form className="rsvp-form" onSubmit={submit}>
        <label>
          Nama
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={120} required placeholder="Nama kamu" />
        </label>
        <label>
          Pesan
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={800} rows={3} required placeholder="Tulis doa/ucapan" />
        </label>
        <button type="submit" className="button gold" disabled={loading}>{loading ? "Mengirim..." : "Kirim ucapan"}</button>
      </form>
      <ul className="guestbook-list">
        {entries.length === 0 ? (
          <li className="muted">Belum ada ucapan. Jadilah yang pertama.</li>
        ) : entries.slice(0, 30).map((entry) => (
          <li key={entry.id} className="guestbook-entry">
            <strong>{entry.name}</strong>
            <p>{entry.message}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ShareSection({ slug, premium }: { slug?: string; premium: boolean }) {
  const toast = useToast();
  const [open, setOpen] = useState(false);
  if (!slug) return null;
  const siteUrl = typeof window !== "undefined"
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || "");
  const fullUrl = siteUrl ? `${siteUrl}/u/${slug}` : `/u/${slug}`;
  const message = `Yuk hadir di pernikahan kami. ${fullUrl}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(fullUrl)}`;

  function copyLink() {
    navigator.clipboard.writeText(fullUrl).then(
      () => toast.push("Link disalin.", "success"),
      () => toast.push("Gagal menyalin.", "error")
    );
  }

  async function nativeShare() {
    if (typeof navigator === "undefined" || !("share" in navigator)) {
      copyLink();
      return;
    }
    try {
      await navigator.share({ title: "Undangan Pernikahan", text: message, url: fullUrl });
    } catch {
      // user dismissed share sheet
    }
  }

  return (
    <section className="invite-section share-section" id="share">
      <span className="eyebrow">Bagikan</span>
      <h2>{premium ? "Sebar undangan ultra eksklusif" : "Sebar undangan"}</h2>
      <div className="share-actions">
        <button type="button" className="button gold" onClick={nativeShare}>Bagikan</button>
        <button type="button" className="button ghost" onClick={copyLink}>Salin link</button>
        <a className="button ghost" href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <button type="button" className="button ghost" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {open ? "Tutup QR" : "QR Code"}
        </button>
      </div>
      {open ? (
        <div className="share-qr">
          {/* External QR provider — small static asset, not loaded through next/image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrSrc} alt="QR code undangan" width={240} height={240} />
          <small className="muted">Scan untuk membuka undangan.</small>
        </div>
      ) : null}
    </section>
  );
}

export function PreviewToolbar({ template }: { template: { name: string; tier: string } }) {
  return (
    <div className="preview-toolbar">
      <div>
        <span>Preview template</span>
        <strong>{template.name}</strong>
      </div>
      <div className="muted">Mode demo — RSVP & ucapan tidak dikirim.</div>
    </div>
  );
}

export function FillData<T extends object>(defaults: T, raw: Partial<T> | undefined | null): T {
  return { ...defaults, ...(raw ?? {}) };
}
