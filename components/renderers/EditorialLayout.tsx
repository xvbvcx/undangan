"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { Divider, WaveOrnament } from "@/components/renderers/Ornaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

// Editorial Magazine — split-screen hero, large numbered sections, magazine
// typography mix, asymmetric gallery. For "Laras Modern", "Aristocrat Sage",
// "Prestige Marble", "Couture Jasmine".
export function EditorialLayout({ invitation, template, data, preview, guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const premium = template.tier === "premium";
  const gallery = invitation.gallery_urls ?? [];
  const cover = gallery[0];

  if (!opened) {
    return (
      <section className="invite-gate gate-editorial" aria-label="Cover undangan">
        <div className="editorial-gate-grid">
          <div className="editorial-gate-photo">
            {cover ? (
              <Image src={cover} alt="Couple cover" fill sizes="50vw" className="gate-image" priority />
            ) : (
              <div className="editorial-placeholder layout-display">{(data.groomNickname || data.groomName || "A").charAt(0)}{(data.brideNickname || data.brideName || "R").charAt(0)}</div>
            )}
            <span className="editorial-photo-tag">Vol. 01 — Wedding</span>
          </div>
          <div className="editorial-gate-content">
            <span className="eyebrow">— Wedding Issue —</span>
            <h1 className="layout-display editorial-display">
              {data.groomNickname || data.groomName || "Mempelai"}
              <span className="amp">&amp;</span>
              {data.brideNickname || data.brideName || "Pasangan"}
            </h1>
            <p className="editorial-tagline">{data.quote || "Two stories becoming one — published exclusively for you."}</p>
            {guestName ? (
              <div className="kepada-yth editorial-yth">
                <span>For</span>
                <strong>{guestName}</strong>
              </div>
            ) : null}
            <p className="editorial-date">{formatDate(data.receptionDate) || "Save the date"}</p>
            <button type="button" className="button gold" onClick={onOpen}>Read Invitation</button>
            {premium ? <span className="royal-seal">Ultra Exclusive</span> : <span className="standard-seal">Nikah Kilat</span>}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section className="invite-hero hero-editorial">
        <div className="editorial-hero-grid">
          <div className="editorial-hero-photo">
            {cover ? (
              <Image src={cover} alt="Couple" fill sizes="50vw" className="editorial-image" priority />
            ) : null}
          </div>
          <div className="editorial-hero-content">
            <span className="eyebrow">— The Wedding Of —</span>
            <h1 className="layout-display editorial-display">
              {data.groomNickname || data.groomName}
              <span className="amp">&amp;</span>
              {data.brideNickname || data.brideName}
            </h1>
            {data.quote ? <blockquote className="editorial-quote">{data.quote}</blockquote> : null}
            <div className="editorial-meta">
              <div><span>Tanggal</span><strong>{formatDate(data.receptionDate)}</strong></div>
              <div><span>Tempat</span><strong>{data.receptionVenue || "TBA"}</strong></div>
            </div>
            <Countdown target={data.receptionDate} />
          </div>
        </div>
      </section>

      <Divider kind="wave" />

      <section className="invite-section couple-section section-editorial">
        <span className="eyebrow">01 — The Couple</span>
        {data.openingText ? <p className="opening-text editorial-opening">{data.openingText}</p> : null}
        <div className="editorial-couple">
          <article className="editorial-person">
            <span className="editorial-person-num">01</span>
            <h2 className="layout-display">{data.groomName || "Pengantin Pria"}</h2>
            <p className="editorial-person-meta">Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
          </article>
          <article className="editorial-person">
            <span className="editorial-person-num">02</span>
            <h2 className="layout-display">{data.brideName || "Pengantin Wanita"}</h2>
            <p className="editorial-person-meta">Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
          </article>
        </div>
      </section>

      <Divider kind="wave" />

      <section className="invite-section event-section section-editorial">
        <span className="eyebrow">02 — Save The Date</span>
        <h2 className="layout-display section-title">Detail Acara</h2>
        <div className="event-grid event-grid-editorial">
          <EventCard title="Akad" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {gallery.length ? (
        <section className="invite-section gallery-section section-editorial">
          <span className="eyebrow">03 — The Gallery</span>
          <h2 className="layout-display section-title">Momen Kami</h2>
          <div className="invite-gallery gallery-grid-editorial">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile editorial-tile editorial-tile-${index % 4}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={800} height={1000} sizes="(max-width: 520px) 100vw, 33vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.story ? (
        <section className="invite-section story-section section-editorial">
          <span className="eyebrow">04 — Love Story</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text editorial-story">{data.story}</p>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={premium} />

      <footer className="invite-footer footer-editorial">
        <WaveOrnament size={120} />
        <p>This issue was published with love by</p>
        <strong className="layout-display editorial-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
        {!premium && !preview ? <span className="watermark">Created with Nikah Kilat</span> : null}
      </footer>
    </>
  );
}
