"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { Ornament, RoseCornerOrnament, LeafOrnament } from "@/components/renderers/Ornaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

// Floral / Botanical — heavy ornament corners on every section, curved photo
// frames, soft pastel palette. Geared toward "Sakura Putih", "Senja Garden",
// and the rest of the floral free templates.
export function FloralLayout({ invitation, template, data, preview, guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const premium = false; // all free now
  const gallery = invitation.gallery_urls ?? [];
  const isBotanical = template.layout === "botanical";

  if (!opened) {
    return (
      <section className={`invite-gate gate-floral ${isBotanical ? "gate-botanical" : ""}`} aria-label="Cover undangan">
        <div className="gate-card floral-gate-card">
          <RoseCornerOrnament className="floral-corner top-left" size={170} />
          <RoseCornerOrnament className="floral-corner top-right" size={170} />
          <span className="eyebrow">Wedding Invitation</span>
          <h1 className="layout-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="amp script-amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          <p className="floral-date">{formatDate(data.receptionDate) || "Tanggal akan diumumkan"}</p>
          {guestName ? (
            <div className="kepada-yth">
              <span>Kepada Yth.</span>
              <strong>{guestName}</strong>
              <small>Mohon maaf bila ada kesalahan penulisan nama.</small>
            </div>
          ) : null}
          <button type="button" className="button gold" onClick={onOpen}>Buka Undangan</button>
          <LeafOrnament className="floral-corner bottom-left" size={170} />
          <LeafOrnament className="floral-corner bottom-right" size={170} />
          {premium ? <span className="royal-seal">Ultra Exclusive</span> : <span className="standard-seal">Nikah Kilat</span>}
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section className="invite-hero hero-floral">
        <RoseCornerOrnament className="floral-corner top-left" size={200} />
        <LeafOrnament className="floral-corner bottom-right" size={200} />
        <span className="eyebrow">Bismillah</span>
        <h1 className="layout-display">
          {data.groomNickname || data.groomName} <span className="script-amp">&amp;</span> {data.brideNickname || data.brideName}
        </h1>
        {data.quote ? <p className="hero-quote">&ldquo;{data.quote}&rdquo;</p> : null}
        <div className="hero-date">{formatDate(data.receptionDate)}</div>
        <Countdown target={data.receptionDate} />
      </section>

      <section className="invite-section couple-section section-floral">
        <RoseCornerOrnament className="section-orn top-left" size={120} />
        <span className="eyebrow">Mempelai</span>
        {data.openingText ? <p className="opening-text">{data.openingText}</p> : null}
        <div className="couple-cards floral-couple">
          <article className="person-card floral-person">
            <div className="person-frame">
              {gallery[0] ? (
                <Image src={gallery[0]} alt="Mempelai Pria" width={420} height={560} className="person-photo" />
              ) : (
                <div className="person-avatar layout-display">{(data.groomNickname || data.groomName || "P").charAt(0)}</div>
              )}
            </div>
            <h2 className="layout-display">{data.groomName || "Pengantin Pria"}</h2>
            <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
          </article>
          <div className="ampersand-bloom" aria-hidden>
            <Ornament kind="rose" size={80} />
          </div>
          <article className="person-card floral-person">
            <div className="person-frame">
              {gallery[1] ? (
                <Image src={gallery[1]} alt="Mempelai Wanita" width={420} height={560} className="person-photo" />
              ) : (
                <div className="person-avatar layout-display">{(data.brideNickname || data.brideName || "W").charAt(0)}</div>
              )}
            </div>
            <h2 className="layout-display">{data.brideName || "Pengantin Wanita"}</h2>
            <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
          </article>
        </div>
        <LeafOrnament className="section-orn bottom-right" size={120} />
      </section>

      <section className="invite-section event-section section-floral">
        <span className="eyebrow">Save The Date</span>
        <h2 className="layout-display section-title">Detail Acara</h2>
        <div className="event-grid event-grid-floral">
          <EventCard title="Akad" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {data.story ? (
        <section className="invite-section story-section section-floral">
          <RoseCornerOrnament className="section-orn top-right" size={100} />
          <span className="eyebrow">Love Story</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text">{data.story}</p>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="invite-section gallery-section">
          <span className="eyebrow">Our Moments</span>
          <h2 className="layout-display section-title">Galeri</h2>
          <div className="invite-gallery gallery-grid-floral">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile floral-tile ${index % 3 === 0 ? "tall" : ""}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={640} height={840} sizes="(max-width: 520px) 50vw, 33vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={premium} />

      <footer className="invite-footer footer-floral">
        <LeafOrnament size={120} />
        <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
        <strong className="layout-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
        {null}
      </footer>
    </>
  );
}
