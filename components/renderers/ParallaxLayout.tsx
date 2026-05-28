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
 * Parallax layout — full-bleed photo backdrops on every section, with
 * fixed/scaled backgrounds, large editorial typography, and white-on-dark
 * gradient overlays. Cinematic-adjacent but structurally distinct: each
 * section is its own fixed-bg "scene".
 */
export function ParallaxLayout({
  invitation, template, data, preview,
  guestName, guestSlug, musicUrl, opened, onOpen
}: LayoutProps) {
  const gallery = invitation.gallery_urls ?? [];
  const cover = gallery[0];
  const sceneA = gallery[2] ?? cover;
  const sceneB = gallery[3] ?? gallery[1] ?? cover;

  if (!opened) {
    return (
      <section
        className="invite-gate gate-parallax"
        style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,.85) 100%), url('${cover}')` } : undefined}
        aria-label="Cover undangan"
      >
        <div className="parallax-gate-card">
          <span className="eyebrow parallax-eyebrow">— A Cinematic Wedding —</span>
          <h1 className="layout-display parallax-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          {guestName ? (
            <div className="kepada-yth parallax-yth">
              <span>Untuk</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <p className="parallax-date">{formatDate(data.receptionDate) || "Save the date"}</p>
          <button type="button" className="button gold" onClick={onOpen}>Buka Undangan</button>
        </div>
      </section>
    );
  }

  return (
    <div className="parallax-shell">
      <MusicToggle src={musicUrl} />

      {/* Cover */}
      <section
        id="cover"
        className="invite-section parallax-scene parallax-cover"
        style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.3) 0%, rgba(0,0,0,.85) 100%), url('${cover}')` } : undefined}
      >
        <div className="parallax-scene-inner">
          <Reveal animation="fadeInDown" className="eyebrow parallax-eyebrow">Presents</Reveal>
          <Reveal as="h1" animation="zoomIn" delay={160} className="layout-display parallax-display">
            {data.groomNickname || data.groomName} <span className="amp">&amp;</span> {data.brideNickname || data.brideName}
          </Reveal>
          <Reveal animation="fadeInUp" delay={300} className="parallax-date">
            {formatDate(data.receptionDate) || "Save the date"}
          </Reveal>
          <Reveal animation="fadeInUp" delay={420}>
            <Countdown target={data.receptionDate} />
          </Reveal>
        </div>
      </section>

      {/* Quote */}
      {data.quote ? (
        <section id="quote" className="invite-section parallax-quote-section">
          <Reveal animation="fadeInDown" className="eyebrow parallax-eyebrow">Quote</Reveal>
          <Reveal as="blockquote" animation="zoomIn" delay={120} className="parallax-quote">
            &ldquo;{data.quote}&rdquo;
          </Reveal>
          {data.openingText ? (
            <Reveal animation="fadeInUp" delay={240} className="opening-text">{data.openingText}</Reveal>
          ) : null}
        </section>
      ) : null}

      {/* Couple */}
      <section id="couple" className="invite-section parallax-couple-section">
        <Reveal animation="fadeInDown" className="eyebrow parallax-eyebrow">The Couple</Reveal>
        <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">Pengantin</Reveal>
        <div className="parallax-couple">
          <Reveal animation="fadeInLeft" delay={120} className="parallax-person">
            {gallery[0] ? (
              <Image src={gallery[0]} alt="Mempelai Pria" width={720} height={960} className="parallax-portrait" />
            ) : null}
            <div className="parallax-person-meta">
              <span className="person-label">Mempelai Pria</span>
              <h3 className="layout-display">{data.groomName || "Pengantin Pria"}</h3>
              <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
            </div>
          </Reveal>
          <Reveal animation="fadeInRight" delay={240} className="parallax-person reverse">
            <div className="parallax-person-meta">
              <span className="person-label">Mempelai Wanita</span>
              <h3 className="layout-display">{data.brideName || "Pengantin Wanita"}</h3>
              <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
            </div>
            {gallery[1] ? (
              <Image src={gallery[1]} alt="Mempelai Wanita" width={720} height={960} className="parallax-portrait" />
            ) : null}
          </Reveal>
        </div>
      </section>

      {/* Event scene */}
      <section
        id="event"
        className="invite-section parallax-scene parallax-event"
        style={sceneA ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.9) 100%), url('${sceneA}')` } : undefined}
      >
        <div className="parallax-scene-inner">
          <Reveal animation="fadeInDown" className="eyebrow parallax-eyebrow">Save The Date</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">The Event</Reveal>
          <div className="event-grid parallax-events">
            <Reveal animation="fadeInLeft" delay={120}>
              <EventCard title="Akad" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
            </Reveal>
            <Reveal animation="fadeInRight" delay={240}>
              <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Story scene before Gallery */}
      {data.story ? (
        <section
          id="story"
          className="invite-section parallax-scene parallax-story"
          style={sceneB ? { backgroundImage: `linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.9) 100%), url('${sceneB}')` } : undefined}
        >
          <div className="parallax-scene-inner">
            <Reveal animation="fadeInDown" className="eyebrow parallax-eyebrow">Love Story</Reveal>
            <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</Reveal>
            <Reveal animation="fadeInUp" delay={240} className="story-text parallax-story-text">{data.story}</Reveal>
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {gallery.length ? (
        <section id="gallery" className="invite-section parallax-gallery-section">
          <Reveal animation="fadeInDown" className="eyebrow parallax-eyebrow">Our Moments</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">Galeri</Reveal>
          <div className="invite-gallery parallax-gallery">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile parallax-tile ${index === 0 ? "feature" : ""}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={1200} height={1500} sizes="(max-width:860px) 100vw, 33vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
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

      <footer id="thanks" className="invite-footer footer-parallax" data-animate="fadeInUp">
        <Ornament kind={template.ornament} size={90} />
        <p>Directed by love. Presented to you with gratitude.</p>
        <strong className="layout-display parallax-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
      </footer>
    </div>
  );
}
