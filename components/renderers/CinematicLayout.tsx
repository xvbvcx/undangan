"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { StarsOrnament } from "@/components/renderers/Ornaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

// Cinematic — full-bleed photo backgrounds, large typography, white-on-dark
// gradients. Designed for premium templates that want a "movie poster" feel:
// "Monarch Pearl", "Eternal Diamond", "Regal Moonlight", etc.
export function CinematicLayout({ invitation, template, data, preview, guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const premium = false; // all free now
  const gallery = invitation.gallery_urls ?? [];
  const heroImage = gallery[0];

  if (!opened) {
    return (
      <section
        className="invite-gate gate-cinematic"
        aria-label="Cover undangan"
        style={heroImage ? { backgroundImage: `linear-gradient(180deg, rgba(8,7,5,.45) 0%, rgba(8,7,5,.85) 100%), url('${heroImage}')` } : undefined}
      >
        <div className="gate-card cinematic-gate-card">
          <StarsOrnament className="cinematic-stars" size={140} />
          <span className="eyebrow cinematic-eyebrow">A Cinematic Wedding</span>
          <h1 className="layout-display cinematic-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          {guestName ? (
            <div className="kepada-yth cinematic-yth">
              <span>Untuk</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <p className="cinematic-date">{formatDate(data.receptionDate) || "Save the date"}</p>
          <button type="button" className="button gold" onClick={onOpen}>Open The Story</button>
          {premium ? <span className="royal-seal big">Ultra Exclusive</span> : <span className="standard-seal">Nikah Kilat</span>}
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section
        className="invite-hero hero-cinematic"
        style={heroImage ? { backgroundImage: `linear-gradient(180deg, rgba(8,7,5,.4) 0%, rgba(8,7,5,.85) 100%), url('${heroImage}')` } : undefined}
      >
        <div className="cinematic-hero-inner">
          <span className="eyebrow cinematic-eyebrow">Presents</span>
          <h1 className="layout-display cinematic-display">
            {data.groomNickname || data.groomName}
            <span className="amp">&amp;</span>
            {data.brideNickname || data.brideName}
          </h1>
          {data.quote ? <p className="hero-quote cinematic-quote">&ldquo;{data.quote}&rdquo;</p> : null}
          <div className="cinematic-meta">
            <span>{formatDate(data.receptionDate)}</span>
            {data.receptionVenue ? <span>{data.receptionVenue}</span> : null}
          </div>
          <Countdown target={data.receptionDate} />
        </div>
      </section>

      <section className="invite-section couple-section section-cinematic">
        <span className="eyebrow cinematic-eyebrow">The Couple</span>
        {data.openingText ? <p className="opening-text cinematic-opening">{data.openingText}</p> : null}
        <div className="cinematic-couple">
          <article className="cinematic-person">
            {gallery[0] ? <Image src={gallery[0]} alt="Mempelai Pria" width={720} height={960} className="cinematic-portrait" /> : null}
            <div className="cinematic-person-meta">
              <span>Mempelai Pria</span>
              <h2 className="layout-display">{data.groomName || "Pengantin Pria"}</h2>
              <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
            </div>
          </article>
          <article className="cinematic-person reverse">
            <div className="cinematic-person-meta">
              <span>Mempelai Wanita</span>
              <h2 className="layout-display">{data.brideName || "Pengantin Wanita"}</h2>
              <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
            </div>
            {gallery[1] ? <Image src={gallery[1]} alt="Mempelai Wanita" width={720} height={960} className="cinematic-portrait" /> : null}
          </article>
        </div>
      </section>

      <section
        className="invite-section event-section section-cinematic event-cinema"
        style={gallery[2] ? { backgroundImage: `linear-gradient(180deg, rgba(8,7,5,.7) 0%, rgba(8,7,5,.95) 100%), url('${gallery[2]}')` } : undefined}
      >
        <span className="eyebrow cinematic-eyebrow">Save The Date</span>
        <h2 className="layout-display section-title">The Event</h2>
        <div className="event-grid event-grid-cinematic">
          <EventCard title="Akad" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {data.story ? (
        <section className="invite-section story-section section-cinematic">
          <span className="eyebrow cinematic-eyebrow">Love Story</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text cinematic-story">{data.story}</p>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="invite-section gallery-section">
          <span className="eyebrow cinematic-eyebrow">Cinematic Moments</span>
          <h2 className="layout-display section-title">Galeri</h2>
          <div className="invite-gallery gallery-grid-cinematic">
            {gallery.slice(0, 8).map((url, index) => (
              <div
                key={url}
                className={`gallery-tile cinematic-tile ${index === 0 ? "feature" : ""} ${index % 5 === 4 ? "tall" : ""}`}
              >
                <Image src={url} alt={`Galeri ${index + 1}`} width={1200} height={1500} sizes="(max-width: 520px) 100vw, 50vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={premium} />

      <footer className="invite-footer footer-cinematic">
        <p>Directed by love. Presented to you with gratitude.</p>
        <strong className="layout-display cinematic-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
        {null}
      </footer>
    </>
  );
}
