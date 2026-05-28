"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import type { GuestbookRecord, InvitationData, InvitationRecord, TemplateMeta } from "@/lib/types";
import { emptyInvitationData } from "@/lib/types";
import { formatDate } from "@/lib/format";
import { safeAudioUrl, safeUrl } from "@/lib/sanitize";
import { useToast } from "@/components/Toast";

type Props = {
  invitation: Partial<InvitationRecord> & { id?: string };
  template: TemplateMeta;
  preview?: boolean;
  guestName?: string;
  guestSlug?: string;
};

function fillInvitationData(raw: Partial<InvitationData> | undefined | null): InvitationData {
  return { ...emptyInvitationData, ...(raw ?? {}) };
}

function diffParts(target?: string) {
  if (!target) return null;
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return null;
  const ms = Math.max(0, date.getTime() - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = Math.floor((ms % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

export function InvitationRenderer({ invitation, template, preview = false, guestName, guestSlug }: Props) {
  const data = useMemo(() => fillInvitationData(invitation.data), [invitation.data]);
  const premium = template.tier === "premium";
  const gallery = invitation.gallery_urls ?? [];
  const safeGuestName = guestName?.trim().slice(0, 80) ?? "";

  const [opened, setOpened] = useState(false);
  const [countdown, setCountdown] = useState(() => diffParts(data.receptionDate));
  const [musicOn, setMusicOn] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Persist gate state per-invitation so refresh doesn't kick the guest back
  // to the cover screen.
  useEffect(() => {
    if (preview || !invitation.id) return;
    if (typeof window === "undefined") return;
    const key = `invite-opened:${invitation.id}`;
    if (window.sessionStorage.getItem(key) === "1") setOpened(true);
  }, [invitation.id, preview]);

  useEffect(() => {
    if (!opened || preview || !invitation.id) return;
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(`invite-opened:${invitation.id}`, "1");
  }, [opened, invitation.id, preview]);

  // Bump the view counter exactly once per gate open.
  useEffect(() => {
    if (!opened || preview || !invitation.id) return;
    void fetch("/api/page-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId: invitation.id, guestSlug })
    }).catch(() => {});
  }, [opened, invitation.id, preview, guestSlug]);

  // Real-time countdown — refresh once per second so seconds tick visibly.
  useEffect(() => {
    if (!data.receptionDate) return;
    const update = () => setCountdown(diffParts(data.receptionDate));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [data.receptionDate]);

  const initials = useMemo(() => {
    const groomChar = (data.groomNickname || data.groomName || "A").charAt(0).toUpperCase();
    const brideChar = (data.brideNickname || data.brideName || "R").charAt(0).toUpperCase();
    return `${groomChar} & ${brideChar}`;
  }, [data]);

  const safeMusicUrl = safeAudioUrl(data.musicUrl);
  const akadMaps = safeUrl(data.akadMaps);
  const receptionMaps = safeUrl(data.receptionMaps);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
      setMusicOn(false);
    } else {
      audio.play().then(() => setMusicOn(true)).catch(() => setMusicOn(false));
    }
  }

  return (
    <div
      className={`invite-page ${premium ? "invite-premium" : "invite-free"} palette-${template.palette} animation-${template.animation}`}
      style={{ "--accent": template.accent } as React.CSSProperties}
    >
      {!opened ? (
        <section className="invite-gate" aria-label="Cover undangan">
          <div className="gate-card">
            <span className="eyebrow">Undangan Pernikahan</span>
            <h1>{data.groomNickname || data.groomName || "Mempelai"} & {data.brideNickname || data.brideName || "Pasangan"}</h1>
            {safeGuestName ? (
              <div className="kepada-yth">
                <span>Kepada Yth.</span>
                <strong>{safeGuestName}</strong>
                <small>Mohon maaf bila ada kesalahan penulisan nama.</small>
              </div>
            ) : null}
            <p>{formatDate(data.receptionDate)}</p>
            <button type="button" className="button gold" onClick={() => setOpened(true)}>Buka Undangan</button>
            {premium ? <div className="royal-seal">Ultra Exclusive</div> : <div className="standard-seal">Nikah Kilat</div>}
          </div>
        </section>
      ) : (
        <>
          {safeMusicUrl ? (
            <>
              <audio ref={audioRef} src={safeMusicUrl} loop preload="none" aria-label="Backsound undangan" />
              <button
                type="button"
                onClick={toggleMusic}
                className={`music-toggle ${musicOn ? "on" : ""}`}
                aria-pressed={musicOn}
                aria-label={musicOn ? "Matikan musik" : "Putar musik"}
              >
                <span className="music-icon" aria-hidden>{musicOn ? "❚❚" : "▶"}</span>
                <span className="sr-only">Musik</span>
              </button>
            </>
          ) : null}

          <section className="invite-hero">
            <div className="hero-ornament" />
            <span className="eyebrow">The Wedding of</span>
            <h1>
              {data.groomNickname || data.groomName || "Pengantin"} <span>&</span> {data.brideNickname || data.brideName || "Pasangan"}
            </h1>
            {data.quote ? <p>{data.quote}</p> : null}
            <div className="hero-date">{formatDate(data.receptionDate)}</div>
            {countdown ? (
              <div className="countdown-card">
                <Slot label="Hari" value={countdown.days} />
                <Slot label="Jam" value={countdown.hours} />
                <Slot label="Menit" value={countdown.minutes} />
                <Slot label="Detik" value={countdown.seconds} />
              </div>
            ) : null}
          </section>

          <section className="invite-section couple-section">
            <span className="eyebrow">Assalamu&rsquo;alaikum Wr. Wb.</span>
            {data.openingText ? <p>{data.openingText}</p> : null}
            <div className="couple-cards">
              <article className="person-card">
                <div className="avatar">{(data.groomNickname || data.groomName || "P").charAt(0).toUpperCase()}</div>
                <h2>{data.groomName || "Nama Pengantin Pria"}</h2>
                <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
              </article>
              <div className="ampersand" aria-hidden>{initials}</div>
              <article className="person-card">
                <div className="avatar">{(data.brideNickname || data.brideName || "W").charAt(0).toUpperCase()}</div>
                <h2>{data.brideName || "Nama Pengantin Wanita"}</h2>
                <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
              </article>
            </div>
          </section>

          <section className="invite-section event-section">
            <span className="eyebrow">Detail Acara</span>
            <div className="event-grid">
              <EventCard
                title="Akad / Pemberkatan"
                date={data.akadDate}
                time={data.akadTime}
                venue={data.akadVenue}
                address={data.akadAddress}
                maps={akadMaps}
              />
              <EventCard
                title="Resepsi"
                date={data.receptionDate}
                time={data.receptionTime}
                venue={data.receptionVenue}
                address={data.receptionAddress}
                maps={receptionMaps}
              />
            </div>
          </section>

          {gallery.length ? (
            <section className="invite-section gallery-section">
              <span className="eyebrow">Galeri</span>
              <h2>Momen Kami</h2>
              <div className="invite-gallery">
                {gallery.slice(0, 8).map((url, index) => (
                  <div key={url} className="gallery-tile">
                    <Image
                      src={url}
                      alt={`Galeri ${index + 1}`}
                      width={640}
                      height={840}
                      sizes="(max-width: 520px) 50vw, (max-width: 860px) 33vw, 25vw"
                      className="gallery-image"
                      loading={index < 2 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {data.story ? (
            <section className="invite-section story-section">
              <span className="eyebrow">Love Story</span>
              <h2>{data.storyTitle || "Cerita Kami"}</h2>
              <p>{data.story}</p>
            </section>
          ) : null}

          {(data.giftBank || data.giftAccount || data.giftQris) ? (
            <GiftSection
              giftBank={data.giftBank}
              giftAccount={data.giftAccount}
              giftName={data.giftName}
              giftQris={safeUrl(data.giftQris)}
            />
          ) : null}

          <RsvpSection invitationId={invitation.id} preview={preview} guestName={safeGuestName} guestSlug={guestSlug} />
          <GuestbookSection invitationId={invitation.id} preview={preview} />

          <ShareSection
            slug={invitation.slug}
            premium={premium}
            isOpen={shareOpen}
            onToggle={() => setShareOpen((v) => !v)}
          />

          <footer className="invite-footer">
            <p>Terima kasih atas doa dan restunya.</p>
            {!premium && !preview ? <span className="watermark">Created with Nikah Kilat</span> : null}
          </footer>
        </>
      )}
    </div>
  );
}

function Slot({ label, value }: { label: string; value: number }) {
  return (
    <div className="countdown-slot">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

function EventCard({ title, date, time, venue, address, maps }: { title: string; date?: string; time?: string; venue?: string; address?: string; maps?: string }) {
  return (
    <div className="event-card">
      <h3>{title}</h3>
      <strong>{formatDate(date)}</strong>
      <p>{time || "Waktu menyusul"}</p>
      <p>{venue || "Tempat menyusul"}</p>
      {address ? <small>{address}</small> : null}
      {maps ? (
        <a className="button ghost" href={maps} target="_blank" rel="noopener noreferrer">Buka Maps</a>
      ) : null}
    </div>
  );
}

function GiftSection({ giftBank, giftAccount, giftName, giftQris }: { giftBank: string; giftAccount: string; giftName: string; giftQris: string }) {
  const toast = useToast();
  function copyAccount() {
    if (!giftAccount) return;
    navigator.clipboard.writeText(giftAccount).then(
      () => toast.push("Nomor rekening disalin.", "success"),
      () => toast.push("Gagal menyalin.", "error")
    );
  }
  return (
    <section className="invite-section gift-section">
      <span className="eyebrow">Kado Digital</span>
      <div className="gift-card">
        {giftBank ? <strong>{giftBank}</strong> : null}
        {giftAccount ? (
          <button type="button" className="gift-account" onClick={copyAccount} aria-label="Salin nomor rekening">
            <span>{giftAccount}</span>
            <small>Klik untuk salin</small>
          </button>
        ) : null}
        {giftName ? <small>a.n. {giftName}</small> : null}
        {giftQris ? (
          <Image
            src={giftQris}
            alt="QRIS kado digital"
            width={240}
            height={240}
            className="gift-qris"
          />
        ) : null}
      </div>
    </section>
  );
}

function RsvpSection({ invitationId, preview, guestName, guestSlug }: { invitationId?: string; preview?: boolean; guestName?: string; guestSlug?: string }) {
  const toast = useToast();
  const [name, setName] = useState(guestName ?? "");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState<"hadir" | "tidak_hadir" | "ragu">("hadir");
  const [guestCount, setGuestCount] = useState(1);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!invitationId) return null;

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
        body: JSON.stringify({ invitationId, name, message, attendance, guestCount, guestSlug })
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

function GuestbookSection({ invitationId, preview }: { invitationId?: string; preview?: boolean }) {
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

function ShareSection({ slug, premium, isOpen, onToggle }: { slug?: string; premium: boolean; isOpen: boolean; onToggle: () => void }) {
  const toast = useToast();
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
      // ignore — user dismissed the share sheet
    }
  }

  return (
    <section className="invite-section share-section" id="share">
      <span className="eyebrow">Bagikan</span>
      <h2>{premium ? "Sebar undangan ultra eksklusif" : "Sebar undangan"}</h2>
      <div className="share-actions">
        <button type="button" className="button gold" onClick={nativeShare}>Bagikan</button>
        <button type="button" className="button ghost" onClick={copyLink}>Salin link</button>
        <a
          className="button ghost"
          href={`https://wa.me/?text=${encodeURIComponent(message)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp
        </a>
        <button type="button" className="button ghost" onClick={onToggle} aria-expanded={isOpen}>
          {isOpen ? "Tutup QR" : "QR Code"}
        </button>
      </div>
      {isOpen ? (
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
