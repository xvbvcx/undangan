"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { Ornament } from "@/components/renderers/Ornaments";
import { Reveal } from "@/components/renderers/Reveal";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

/**
 * Postcard layout — feels like a stamped travel postcard. Each section is
 * a tilted card on a "paper" surface with stamp/postmark accents. Distinct
 * structurally from the other layouts: every section is a horizontal
 * card with the photo on one side and copy on the other.
 */
export function PostcardLayout({
  invitation, template, data, preview,
  guestName, guestSlug, musicUrl, opened, onOpen
}: LayoutProps) {
  const gallery = invitation.gallery_urls ?? [];
  const cover = gallery[0];

  if (!opened) {
    return (
      <section className="invite-gate gate-postcard" aria-label="Cover undangan">
        <div className="postcard-gate">
          <div className="postcard-stamp" aria-hidden>
            <Ornament kind={template.ornament} size={60} />
          </div>
          <div className="postcard-postmark" aria-hidden>
            <span>{formatDate(data.receptionDate) || "Save the date"}</span>
            <span>POS · NK</span>
          </div>
          <span className="eyebrow">Postcard from</span>
          <h1 className="layout-display postcard-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          <p className="postcard-line">— Wish you were here —</p>
          {guestName ? (
            <div className="kepada-yth postcard-yth">
              <span>To,</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <button type="button" className="button gold" onClick={onOpen}>Open Postcard</button>
        </div>
      </section>
    );
  }

  return (
    <div className="postcard-shell">
      <MusicToggle src={musicUrl} />

      {/* Cover */}
      <section id="cover" className="invite-section postcard-cover">
        <Reveal animation="fadeInDown" className="postcard-card postcard-cover-card">
          <div className="postcard-photo">
            {cover ? (
              <Image src={cover} alt="Couple" fill sizes="(max-width:860px) 100vw, 50vw" className="postcard-image" priority />
            ) : (
              <div className="postcard-placeholder layout-display">
                {(data.groomNickname || data.groomName || "A").charAt(0)}
                {(data.brideNickname || data.brideName || "R").charAt(0)}
              </div>
            )}
          </div>
          <div className="postcard-text">
            <span className="eyebrow">The Wedding Of</span>
            <h1 className="layout-display postcard-display">
              {data.groomNickname || data.groomName} <span className="amp">&amp;</span> {data.brideNickname || data.brideName}
            </h1>
            <p className="postcard-date">{formatDate(data.receptionDate) || "Save the date"}</p>
            <Countdown target={data.receptionDate} />
          </div>
        </Reveal>
      </section>

      {/* Quote */}
      {data.quote ? (
        <section id="quote" className="invite-section postcard-quote-section">
          <Reveal animation="zoomIn" className="postcard-card postcard-note">
            <span className="postcard-note-tag">— Note —</span>
            <p className="postcard-quote">&ldquo;{data.quote}&rdquo;</p>
            {data.openingText ? <p className="opening-text">{data.openingText}</p> : null}
          </Reveal>
        </section>
      ) : null}

      {/* Couple */}
      <section id="couple" className="invite-section postcard-couple-section">
        <Reveal animation="fadeInDown" className="eyebrow center">The Couple</Reveal>
        <div className="postcard-couple-stack">
          <Reveal animation="fadeInLeft" delay={120} className="postcard-card postcard-person tilt-left">
            <div className="postcard-photo small">
              {gallery[0] ? (
                <Image src={gallery[0]} alt="Mempelai Pria" width={420} height={420} className="postcard-image" />
              ) : (
                <div className="postcard-placeholder layout-display">{(data.groomNickname || data.groomName || "P").charAt(0)}</div>
              )}
            </div>
            <div className="postcard-text">
              <span className="person-label">Mempelai Pria</span>
              <h3 className="layout-display">{data.groomName || "Pengantin Pria"}</h3>
              <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
            </div>
          </Reveal>
          <Reveal animation="fadeInRight" delay={240} className="postcard-card postcard-person tilt-right">
            <div className="postcard-photo small">
              {gallery[1] ? (
                <Image src={gallery[1]} alt="Mempelai Wanita" width={420} height={420} className="postcard-image" />
              ) : (
                <div className="postcard-placeholder layout-display">{(data.brideNickname || data.brideName || "W").charAt(0)}</div>
              )}
            </div>
            <div className="postcard-text">
              <span className="person-label">Mempelai Wanita</span>
              <h3 className="layout-display">{data.brideName || "Pengantin Wanita"}</h3>
              <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Event */}
      <section id="event" className="invite-section postcard-event-section">
        <Reveal animation="fadeInDown" className="eyebrow center">Save The Date</Reveal>
        <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title center">Detail Acara</Reveal>
        <div className="event-grid postcard-events">
          <Reveal animation="fadeInLeft" delay={120}>
            <EventCard title="Akad" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          </Reveal>
          <Reveal animation="fadeInRight" delay={240}>
            <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
          </Reveal>
        </div>
      </section>

      {/* Story before Gallery */}
      {data.story ? (
        <section id="story" className="invite-section postcard-story-section">
          <Reveal animation="fadeInDown" className="eyebrow center">Love Story</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title center">{data.storyTitle || "Cerita Kami"}</Reveal>
          <Reveal animation="fadeInUp" delay={240} className="postcard-card postcard-letter">
            <p className="story-text">{data.story}</p>
          </Reveal>
        </section>
      ) : null}

      {/* Gallery */}
      {gallery.length ? (
        <section id="gallery" className="invite-section postcard-gallery-section">
          <Reveal animation="fadeInDown" className="eyebrow center">Our Moments</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title center">Galeri</Reveal>
          <div className="invite-gallery postcard-gallery">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile postcard-tile tilt-${index % 3}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={640} height={840} sizes="(max-width:860px) 50vw, 25vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
                <span className="postcard-tile-tag">No. {String(index + 1).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section id="gift">
        <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      </section>

      <section id="ucapan">
        <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
        <GuestbookSection invitationId={invitation.id} preview={preview} />
      </section>

      <ShareSection slug={invitation.slug} premium={false} />

      <footer id="thanks" className="invite-footer footer-postcard" data-animate="fadeInUp">
        <Ornament kind={template.ornament} size={80} />
        <p>Sent with love.</p>
        <strong className="layout-display postcard-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
      </footer>
    </div>
  );
}
