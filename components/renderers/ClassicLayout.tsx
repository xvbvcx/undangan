"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { Ornament } from "@/components/renderers/Ornaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

// Classic Romantic — symmetrical centered layout with arch frame, script
// initials, and a single subtle ornament per section. Designed for free /
// timeless wedding invitations: think cream paper texture, soft palette,
// serif headlines, romantic feel.
export function ClassicLayout({ invitation, template, data, preview, guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const premium = template.tier === "premium";
  const initialsTop = (data.groomNickname || data.groomName || "A").charAt(0).toUpperCase();
  const initialsBottom = (data.brideNickname || data.brideName || "R").charAt(0).toUpperCase();
  const gallery = invitation.gallery_urls ?? [];

  if (!opened) {
    return (
      <section className="invite-gate gate-classic" aria-label="Cover undangan">
        <div className="gate-card classic-gate-card">
          <Ornament kind={template.ornament} className="gate-orn gate-orn-top" size={140} />
          <span className="eyebrow">The Wedding Of</span>
          <div className="classic-monogram">
            <strong>{initialsTop}</strong>
            <em>&</em>
            <strong>{initialsBottom}</strong>
          </div>
          <h1 className="layout-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <small>&amp;</small>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          {guestName ? (
            <div className="kepada-yth">
              <span>Kepada Yth.</span>
              <strong>{guestName}</strong>
              <small>Mohon maaf bila ada kesalahan penulisan nama.</small>
            </div>
          ) : null}
          <p>{formatDate(data.receptionDate) || "Tanggal akan diumumkan"}</p>
          <button type="button" className="button gold" onClick={onOpen}>Buka Undangan</button>
          <Ornament kind={template.ornament} className="gate-orn gate-orn-bottom" size={120} />
          {premium ? <span className="royal-seal">Ultra Exclusive</span> : <span className="standard-seal">Nikah Kilat</span>}
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section className="invite-hero hero-classic">
        <Ornament kind={template.ornament} className="hero-orn hero-orn-top" size={160} />
        <span className="eyebrow">The Wedding Celebration</span>
        <h1 className="layout-display">
          {data.groomNickname || data.groomName} <span className="amp">&amp;</span> {data.brideNickname || data.brideName}
        </h1>
        {data.quote ? <p className="hero-quote">&ldquo;{data.quote}&rdquo;</p> : null}
        <div className="hero-date">{formatDate(data.receptionDate)}</div>
        <Countdown target={data.receptionDate} />
        <Ornament kind={template.ornament} className="hero-orn hero-orn-bottom" size={140} />
      </section>

      <section className="invite-section couple-section">
        <span className="eyebrow">Bismillahirrahmanirrahim</span>
        {data.openingText ? <p className="opening-text">{data.openingText}</p> : null}
        <div className="couple-cards">
          <article className="person-card classic-person">
            <span className="person-label">Mempelai Pria</span>
            <h2 className="layout-display">{data.groomName || "Nama Pengantin Pria"}</h2>
            <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
          </article>
          <div className="ampersand classic-amp" aria-hidden>
            <Ornament kind={template.ornament} size={60} />
          </div>
          <article className="person-card classic-person">
            <span className="person-label">Mempelai Wanita</span>
            <h2 className="layout-display">{data.brideName || "Nama Pengantin Wanita"}</h2>
            <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
          </article>
        </div>
      </section>

      <section className="invite-section event-section">
        <span className="eyebrow">Detail Acara</span>
        <h2 className="layout-display section-title">Save The Date</h2>
        <div className="event-grid event-grid-classic">
          <EventCard title="Akad / Pemberkatan" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {gallery.length ? (
        <section className="invite-section gallery-section">
          <span className="eyebrow">Galeri</span>
          <h2 className="layout-display section-title">Momen Kami</h2>
          <div className="invite-gallery gallery-grid-classic">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className="gallery-tile">
                <Image src={url} alt={`Galeri ${index + 1}`} width={640} height={840} sizes="(max-width: 520px) 50vw, (max-width: 860px) 33vw, 25vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.story ? (
        <section className="invite-section story-section">
          <span className="eyebrow">Love Story</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text">{data.story}</p>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={premium} />

      <footer className="invite-footer footer-classic">
        <Ornament kind={template.ornament} size={90} />
        <p>Terima kasih atas doa dan restunya.</p>
        <strong className="layout-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
        {!premium && !preview ? <span className="watermark">Created with Nikah Kilat</span> : null}
      </footer>
    </>
  );
}
