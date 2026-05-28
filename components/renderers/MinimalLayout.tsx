"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { Divider, GeometricOrnament } from "@/components/renderers/Ornaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

// Minimalist — clean sans + thin gold dividers, monospace metadata, generous
// whitespace. No ornament corners. Aimed at modern minimalist couples.
export function MinimalLayout({ invitation, template, data, preview, guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const premium = false; // all free now
  const gallery = invitation.gallery_urls ?? [];

  if (!opened) {
    return (
      <section className="invite-gate gate-minimal" aria-label="Cover undangan">
        <div className="gate-card minimal-gate-card">
          <span className="minimal-rule" aria-hidden />
          <span className="eyebrow">— Wedding Invitation —</span>
          <h1 className="layout-display minimal-display">
            <span>{data.groomNickname || data.groomName || "Mempelai"}</span>
            <span className="ampersand-line"><span /><em>&amp;</em><span /></span>
            <span>{data.brideNickname || data.brideName || "Pasangan"}</span>
          </h1>
          {guestName ? (
            <div className="kepada-yth minimal-yth">
              <span>Kepada</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <div className="minimal-meta">
            <span>{formatDate(data.receptionDate) || "Save the date"}</span>
          </div>
          <button type="button" className="button dark" onClick={onOpen}>Buka Undangan</button>
          <span className="minimal-rule" aria-hidden />
          {premium ? <span className="standard-seal minimal-seal">Ultra Exclusive</span> : <span className="standard-seal minimal-seal">Nikah Kilat</span>}
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section className="invite-hero hero-minimal">
        <span className="eyebrow">The Wedding</span>
        <h1 className="layout-display minimal-display">
          <span>{data.groomNickname || data.groomName}</span>
          <span className="ampersand-line"><span /><em>&amp;</em><span /></span>
          <span>{data.brideNickname || data.brideName}</span>
        </h1>
        {data.quote ? <p className="hero-quote minimal-quote">{data.quote}</p> : null}
        <div className="minimal-hero-date">
          <span>{formatDate(data.receptionDate)}</span>
          {data.receptionTime ? <span>{data.receptionTime}</span> : null}
        </div>
        <Countdown target={data.receptionDate} />
      </section>

      <Divider kind="geometric" />

      <section className="invite-section couple-section section-minimal">
        <span className="eyebrow">Mempelai</span>
        <div className="couple-grid minimal-couple">
          <article className="person-card minimal-person">
            <span className="person-label">01 — Mempelai Pria</span>
            <h2 className="layout-display">{data.groomName || "Pengantin Pria"}</h2>
            <p>Putra dari Bapak {data.groomFather || "..."}<br />& Ibu {data.groomMother || "..."}</p>
          </article>
          <article className="person-card minimal-person">
            <span className="person-label">02 — Mempelai Wanita</span>
            <h2 className="layout-display">{data.brideName || "Pengantin Wanita"}</h2>
            <p>Putri dari Bapak {data.brideFather || "..."}<br />& Ibu {data.brideMother || "..."}</p>
          </article>
        </div>
      </section>

      <Divider kind="geometric" />

      <section className="invite-section event-section section-minimal">
        <span className="eyebrow">Save The Date</span>
        <h2 className="layout-display section-title">Detail Acara</h2>
        <div className="event-grid minimal-events">
          <EventCard title="Akad" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {data.story ? (
        <section className="invite-section story-section section-minimal">
          <span className="eyebrow">Love Story</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text minimal-story">{data.story}</p>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="invite-section gallery-section section-minimal">
          <span className="eyebrow">Galeri</span>
          <div className="invite-gallery gallery-grid-minimal">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className="gallery-tile minimal-tile">
                <Image src={url} alt={`Galeri ${index + 1}`} width={640} height={640} sizes="(max-width: 520px) 50vw, 25vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={premium} />

      <footer className="invite-footer footer-minimal">
        <GeometricOrnament size={48} />
        <p>Terima kasih atas doa dan restunya.</p>
        <strong className="layout-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
        {null}
      </footer>
    </>
  );
}
