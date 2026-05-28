"use client";

import { useEffect, useMemo, useState } from "react";
import type { InvitationRecord, TemplateMeta } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function InvitationRenderer({ invitation, template, preview = false }: { invitation: Partial<InvitationRecord>; template: TemplateMeta; preview?: boolean }) {
  const data = invitation.data!;
  const premium = template.tier === "premium";
  const gallery = invitation.gallery_urls || [];
  const [opened, setOpened] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    if (!data?.receptionDate) return;
    const target = new Date(data.receptionDate).getTime();
    const update = () => setDaysLeft(Math.max(0, Math.ceil((target - Date.now()) / 86400000)));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [data?.receptionDate]);

  const initials = useMemo(() => `${(data?.groomNickname || data?.groomName || "A")[0] || "A"} & ${(data?.brideNickname || data?.brideName || "R")[0] || "R"}`, [data]);

  return (
    <div className={`invite-page ${premium ? "invite-premium" : "invite-free"} palette-${template.palette}`}>
      {!opened ? (
        <section className="invite-gate">
          <div className="gate-card">
            <span className="eyebrow">Undangan Pernikahan</span>
            <h1>{data?.groomNickname || "Mempelai"} & {data?.brideNickname || "Pasangan"}</h1>
            <p>{formatDate(data?.receptionDate)}</p>
            <button className="button gold" onClick={() => setOpened(true)}>Buka Undangan</button>
            {premium ? <div className="royal-seal">Ultra Exclusive</div> : <div className="standard-seal">Nikah Kilat</div>}
          </div>
        </section>
      ) : (
        <>
          {data?.musicUrl ? <audio src={data.musicUrl} autoPlay loop controls className="music-player" /> : null}
          <section className="invite-hero">
            <div className="hero-ornament" />
            <span className="eyebrow">The Wedding of</span>
            <h1>{data?.groomNickname || data?.groomName || "Pengantin"} <span>&</span> {data?.brideNickname || data?.brideName || "Pasangan"}</h1>
            <p>{data?.quote}</p>
            <div className="hero-date">{formatDate(data?.receptionDate)}</div>
            <div className="countdown-card"><strong>{daysLeft}</strong><span>hari menuju acara</span></div>
          </section>

          <section className="invite-section couple-section">
            <span className="eyebrow">Assalamu’alaikum Wr. Wb.</span>
            <p>{data?.openingText}</p>
            <div className="couple-cards">
              <div className="person-card">
                <div className="avatar">{(data?.groomNickname || data?.groomName || "P")[0]}</div>
                <h2>{data?.groomName || "Nama Pengantin Pria"}</h2>
                <p>Putra dari Bapak {data?.groomFather || "..."} & Ibu {data?.groomMother || "..."}</p>
              </div>
              <div className="ampersand">{initials}</div>
              <div className="person-card">
                <div className="avatar">{(data?.brideNickname || data?.brideName || "W")[0]}</div>
                <h2>{data?.brideName || "Nama Pengantin Wanita"}</h2>
                <p>Putri dari Bapak {data?.brideFather || "..."} & Ibu {data?.brideMother || "..."}</p>
              </div>
            </div>
          </section>

          <section className="invite-section event-section">
            <span className="eyebrow">Detail Acara</span>
            <div className="event-grid">
              <EventCard title="Akad / Pemberkatan" date={data?.akadDate} time={data?.akadTime} venue={data?.akadVenue} address={data?.akadAddress} maps={data?.akadMaps} />
              <EventCard title="Resepsi" date={data?.receptionDate} time={data?.receptionTime} venue={data?.receptionVenue} address={data?.receptionAddress} maps={data?.receptionMaps} />
            </div>
          </section>

          {gallery.length ? (
            <section className="invite-section gallery-section">
              <span className="eyebrow">Galeri</span>
              <h2>Momen Kami</h2>
              <div className="invite-gallery">
                {gallery.slice(0, 8).map((url, index) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={url} src={url} alt={`Galeri ${index + 1}`} />
                ))}
              </div>
            </section>
          ) : null}

          <section className="invite-section story-section">
            <span className="eyebrow">Love Story</span>
            <h2>{data?.storyTitle || "Cerita Kami"}</h2>
            <p>{data?.story}</p>
          </section>

          {(data?.giftBank || data?.giftAccount) ? (
            <section className="invite-section gift-section">
              <span className="eyebrow">Kado Digital</span>
              <div className="gift-card"><strong>{data.giftBank}</strong><span>{data.giftAccount}</span><small>a.n. {data.giftName}</small></div>
            </section>
          ) : null}

          <RSVP invitationId={invitation.id} />

          <footer className="invite-footer">
            <p>Terima kasih atas doa dan restunya.</p>
            {!premium && !preview ? <span className="watermark">Created with Nikah Kilat</span> : null}
          </footer>
        </>
      )}
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
      <small>{address}</small>
      {maps ? <a className="button ghost" href={maps} target="_blank" rel="noreferrer">Buka Maps</a> : null}
    </div>
  );
}

function RSVP({ invitationId }: { invitationId?: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [attendance, setAttendance] = useState("hadir");
  const [sent, setSent] = useState(false);
  if (!invitationId) return null;
  async function submit() {
    await fetch("/api/rsvp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invitationId, name, message, attendance }) });
    setSent(true);
  }
  return (
    <section className="invite-section rsvp-section">
      <span className="eyebrow">RSVP & Ucapan</span>
      {sent ? <div className="success-box">Terima kasih, ucapan kamu sudah terkirim.</div> : (
        <div className="rsvp-form">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
          <select value={attendance} onChange={(e) => setAttendance(e.target.value)}><option value="hadir">Hadir</option><option value="tidak_hadir">Tidak hadir</option><option value="ragu">Masih ragu</option></select>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tulis doa/ucapan" />
          <button className="button gold" onClick={submit}>Kirim RSVP</button>
        </div>
      )}
    </section>
  );
}
