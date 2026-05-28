"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { ArchFrameOrnament, DecoFrameOrnament, Ornament } from "@/components/renderers/Ornaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

// Royal / Luxury — dark luxe gold borders, baroque ornament frame, Cinzel
// display font, arched window cover. Matches "Imperial Aurum", "Velvet
// Royale", "Golden Dynasty", and the rest of the premium royal/luxury tier.
export function RoyalLayout({ invitation, template, data, preview, guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const premium = template.tier === "premium";
  const gallery = invitation.gallery_urls ?? [];

  if (!opened) {
    return (
      <section className="invite-gate gate-royal" aria-label="Cover undangan">
        <ArchFrameOrnament className="royal-arch" size={360} />
        <div className="gate-card royal-gate-card">
          <DecoFrameOrnament className="royal-frame top" size={260} />
          <span className="eyebrow royal-eyebrow">— Wedding Of —</span>
          <h1 className="layout-display royal-display">
            <span>{data.groomNickname || data.groomName || "Mempelai"}</span>
            <em>&amp;</em>
            <span>{data.brideNickname || data.brideName || "Pasangan"}</span>
          </h1>
          {guestName ? (
            <div className="kepada-yth royal-yth">
              <span>To Our Honoured Guest</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <p className="royal-date">{formatDate(data.receptionDate) || "Tanggal akan diumumkan"}</p>
          <button type="button" className="button gold" onClick={onOpen}>Open Invitation</button>
          <DecoFrameOrnament className="royal-frame bottom" size={260} />
          <span className="royal-seal big">Ultra Exclusive</span>
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section className="invite-hero hero-royal">
        <DecoFrameOrnament className="hero-deco-top" size={300} />
        <span className="eyebrow royal-eyebrow">— The Wedding Of —</span>
        <h1 className="layout-display royal-display">
          <span>{data.groomNickname || data.groomName}</span>
          <em className="royal-amp">&amp;</em>
          <span>{data.brideNickname || data.brideName}</span>
        </h1>
        {data.quote ? <p className="hero-quote royal-quote">&ldquo;{data.quote}&rdquo;</p> : null}
        <div className="royal-hero-date">{formatDate(data.receptionDate)}</div>
        <Countdown target={data.receptionDate} />
        <DecoFrameOrnament className="hero-deco-bottom" size={300} />
      </section>

      <section className="invite-section couple-section section-royal">
        <span className="eyebrow royal-eyebrow">— Mempelai —</span>
        {data.openingText ? <p className="opening-text royal-opening">{data.openingText}</p> : null}
        <div className="couple-cards royal-couple">
          <article className="person-card royal-person">
            <div className="royal-medallion">
              {gallery[0] ? (
                <Image src={gallery[0]} alt="Mempelai Pria" width={420} height={420} className="medallion-photo" />
              ) : (
                <span className="layout-display royal-initial">{(data.groomNickname || data.groomName || "P").charAt(0)}</span>
              )}
            </div>
            <h2 className="layout-display">{data.groomName || "Pengantin Pria"}</h2>
            <p>Putra dari<br /><strong>Bapak {data.groomFather || "..."}</strong><br />&amp; <strong>Ibu {data.groomMother || "..."}</strong></p>
          </article>
          <div className="royal-amp-block" aria-hidden>
            <Ornament kind="deco-frame" size={120} />
            <em>&amp;</em>
          </div>
          <article className="person-card royal-person">
            <div className="royal-medallion">
              {gallery[1] ? (
                <Image src={gallery[1]} alt="Mempelai Wanita" width={420} height={420} className="medallion-photo" />
              ) : (
                <span className="layout-display royal-initial">{(data.brideNickname || data.brideName || "W").charAt(0)}</span>
              )}
            </div>
            <h2 className="layout-display">{data.brideName || "Pengantin Wanita"}</h2>
            <p>Putri dari<br /><strong>Bapak {data.brideFather || "..."}</strong><br />&amp; <strong>Ibu {data.brideMother || "..."}</strong></p>
          </article>
        </div>
      </section>

      <section className="invite-section event-section section-royal">
        <span className="eyebrow royal-eyebrow">— Save The Date —</span>
        <h2 className="layout-display section-title">Detail Acara</h2>
        <div className="event-grid event-grid-royal">
          <EventCard title="Akad / Pemberkatan" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {gallery.length ? (
        <section className="invite-section gallery-section section-royal">
          <span className="eyebrow royal-eyebrow">— Our Moments —</span>
          <h2 className="layout-display section-title">Galeri</h2>
          <div className="invite-gallery gallery-grid-royal">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile royal-tile ${index === 0 ? "wide" : ""}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={800} height={1000} sizes="(max-width: 520px) 100vw, 33vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.story ? (
        <section className="invite-section story-section section-royal">
          <span className="eyebrow royal-eyebrow">— Love Story —</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text royal-story">{data.story}</p>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={premium} />

      <footer className="invite-footer footer-royal">
        <DecoFrameOrnament size={200} />
        <p>Atas kehadiran dan doa restu Bapak/Ibu/Saudara/i, kami ucapkan terima kasih.</p>
        <strong className="layout-display royal-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
        {!premium && !preview ? <span className="watermark">Created with Nikah Kilat</span> : null}
      </footer>
    </>
  );
}
