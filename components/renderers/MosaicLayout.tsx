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
 * Mosaic layout — photo-driven, asymmetric. The cover is a 4-tile mosaic
 * with the couple's name overlaid; every section feels gallery-first.
 * Most distinct from sidebar/postcard structurally.
 */
export function MosaicLayout({
  invitation, template, data, preview,
  guestName, guestSlug, musicUrl, opened, onOpen
}: LayoutProps) {
  const gallery = invitation.gallery_urls ?? [];
  const [a, b, c, d] = [gallery[0], gallery[1], gallery[2], gallery[3]];

  if (!opened) {
    return (
      <section className="invite-gate gate-mosaic" aria-label="Cover undangan">
        <div className="mosaic-gate-grid" aria-hidden>
          {[a, b, c, d].map((url, idx) =>
            url ? (
              <div key={idx} className={`mosaic-gate-tile gate-tile-${idx}`}>
                <Image src={url} alt="" fill sizes="50vw" className="mosaic-gate-image" priority={idx === 0} />
              </div>
            ) : (
              <div key={idx} className={`mosaic-gate-tile gate-tile-${idx} placeholder`}>
                <Ornament kind={template.ornament} size={60} />
              </div>
            )
          )}
        </div>
        <div className="mosaic-gate-overlay" />
        <div className="mosaic-gate-card">
          <span className="eyebrow">— Wedding Of —</span>
          <h1 className="layout-display mosaic-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          {guestName ? (
            <div className="kepada-yth mosaic-yth">
              <span>Untuk</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <p className="mosaic-date">{formatDate(data.receptionDate) || "Save the date"}</p>
          <button type="button" className="button gold" onClick={onOpen}>Buka Undangan</button>
        </div>
      </section>
    );
  }

  return (
    <div className="mosaic-shell">
      <MusicToggle src={musicUrl} />

      {/* Cover */}
      <section id="cover" className="invite-section mosaic-cover">
        <div className="mosaic-cover-grid">
          {[a, b, c, d].map((url, idx) =>
            url ? (
              <div key={idx} className={`mosaic-tile cover-tile-${idx}`} data-animate="zoomIn" data-animate-delay={idx * 120}>
                <Image src={url} alt="" fill sizes="50vw" className="mosaic-image" priority={idx < 2} />
              </div>
            ) : (
              <div key={idx} className={`mosaic-tile cover-tile-${idx} placeholder`}>
                <Ornament kind={template.ornament} size={64} />
              </div>
            )
          )}
        </div>
        <div className="mosaic-cover-text">
          <Reveal animation="fadeInDown" className="eyebrow">The Wedding Celebration</Reveal>
          <Reveal as="h1" animation="zoomIn" delay={160} className="layout-display mosaic-display">
            {data.groomNickname || data.groomName} <span className="amp">&amp;</span> {data.brideNickname || data.brideName}
          </Reveal>
          <Reveal animation="fadeInUp" delay={300}>
            <Countdown target={data.receptionDate} />
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      {data.quote ? (
        <section id="quote" className="invite-section mosaic-quote-section">
          <Reveal animation="fadeInDown" className="eyebrow">Quote</Reveal>
          <Reveal as="blockquote" animation="zoomIn" delay={120} className="mosaic-quote">
            &ldquo;{data.quote}&rdquo;
          </Reveal>
        </section>
      ) : null}

      {/* Couple */}
      <section id="couple" className="invite-section mosaic-couple-section">
        <Reveal animation="fadeInDown" className="eyebrow">Mempelai</Reveal>
        <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">Pengantin</Reveal>
        <div className="mosaic-couple">
          <Reveal animation="fadeInLeft" delay={120} className="mosaic-person">
            {gallery[0] ? (
              <Image src={gallery[0]} alt="Mempelai Pria" width={720} height={900} className="mosaic-portrait" />
            ) : null}
            <div className="mosaic-person-meta">
              <span className="person-label">Mempelai Pria</span>
              <h3 className="layout-display">{data.groomName || "Pengantin Pria"}</h3>
              <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
            </div>
          </Reveal>
          <Reveal animation="fadeInRight" delay={240} className="mosaic-person reverse">
            <div className="mosaic-person-meta">
              <span className="person-label">Mempelai Wanita</span>
              <h3 className="layout-display">{data.brideName || "Pengantin Wanita"}</h3>
              <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
            </div>
            {gallery[1] ? (
              <Image src={gallery[1]} alt="Mempelai Wanita" width={720} height={900} className="mosaic-portrait" />
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Event */}
      <section id="event" className="invite-section mosaic-event-section">
        <Reveal animation="fadeInDown" className="eyebrow">Save The Date</Reveal>
        <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">Detail Acara</Reveal>
        <div className="event-grid mosaic-events">
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
        <section id="story" className="invite-section mosaic-story-section">
          <Reveal animation="fadeInDown" className="eyebrow">Love Story</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</Reveal>
          <Reveal animation="fadeInUp" delay={240} className="story-text mosaic-story">{data.story}</Reveal>
        </section>
      ) : null}

      {/* Gallery — full mosaic */}
      {gallery.length ? (
        <section id="gallery" className="invite-section mosaic-gallery-section">
          <Reveal animation="fadeInDown" className="eyebrow">Galeri</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">Momen Kami</Reveal>
          <div className="invite-gallery mosaic-gallery">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile mosaic-tile mosaic-grid-${index % 8}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={1000} height={1200} sizes="(max-width:860px) 50vw, 25vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
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

      <footer id="thanks" className="invite-footer footer-mosaic" data-animate="fadeInUp">
        <Ornament kind={template.ornament} size={80} />
        <p>Terima kasih atas doa dan restunya.</p>
        <strong className="layout-display mosaic-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
      </footer>
    </div>
  );
}
