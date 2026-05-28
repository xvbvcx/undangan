"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import { Ornament } from "@/components/renderers/Ornaments";
import { AdatOrnament } from "@/components/renderers/AdatOrnaments";
import { Reveal } from "@/components/renderers/Reveal";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

/**
 * Sidebar / templateku.id-style layout.
 *
 * Desktop: sticky-left sidebar with monogram + section nav, scrollable
 * right column with the standard section flow.
 * Mobile: sidebar collapses to a sticky top header bar; content scrolls
 * normally.
 *
 * Section order: cover → quote → couple → event → story → gallery →
 * gift → ucapan (RSVP + guestbook) → thanks (footer).
 *
 * Per-element animations are applied via <Reveal animation="..."> which
 * pairs with the IntersectionObserver in useScrollRevealSections.
 */

const NAV: Array<{ id: string; label: string }> = [
  { id: "cover", label: "Cover" },
  { id: "quote", label: "Quote" },
  { id: "couple", label: "Mempelai" },
  { id: "event", label: "Acara" },
  { id: "story", label: "Cerita" },
  { id: "gallery", label: "Galeri" },
  { id: "gift", label: "Hadiah" },
  { id: "ucapan", label: "Ucapan" },
  { id: "thanks", label: "Thanks" },
];

export function SidebarLayout({
  invitation, template, data, preview,
  guestName, guestSlug, musicUrl, opened, onOpen
}: LayoutProps) {
  const gallery = invitation.gallery_urls ?? [];
  const cover = gallery[0];
  const initials = `${(data.groomNickname || data.groomName || "A").charAt(0)}${(data.brideNickname || data.brideName || "R").charAt(0)}`.toUpperCase();
  const isAdat = !!template.culture;
  const ornElement = isAdat
    ? <AdatOrnament culture={template.culture!} size={48} />
    : <Ornament kind={template.ornament} size={42} />;

  // Cover gate is rendered as a full-screen modal over the layout; we
  // already track `opened` upstream. Background uses gallery[0] when
  // available — falls back to a soft palette wash.
  if (!opened) {
    return (
      <section
        className="invite-gate gate-sidebar"
        aria-label="Cover undangan"
        role="dialog"
        aria-modal="true"
        style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(8,7,5,.55) 0%, rgba(8,7,5,.92) 100%), url('${cover}')` } : undefined}
      >
        <div className="sidebar-gate-card">
          <div className="sidebar-gate-orn" aria-hidden>{ornElement}</div>
          <span className="eyebrow">The Wedding Of</span>
          <h1 className="layout-display sidebar-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          {guestName ? (
            <div className="kepada-yth sidebar-yth">
              <span>Kepada Yth.</span>
              <strong>{guestName}</strong>
              <small>Mohon maaf bila ada kesalahan penulisan nama.</small>
            </div>
          ) : null}
          <p className="sidebar-gate-date">{formatDate(data.receptionDate) || "Save the date"}</p>
          <button type="button" className="button gold" onClick={onOpen}>
            <span aria-hidden>✉</span> Buka Undangan
          </button>
          <span className="standard-seal sidebar-seal">Nikah Kilat</span>
        </div>
      </section>
    );
  }

  return (
    <div className="sidebar-shell">
      {/* Floating audio bottom-LEFT */}
      <MusicToggle src={musicUrl} />

      {/* Sticky sidebar (desktop) / collapsible top bar (mobile) */}
      <SidebarRail
        initials={initials}
        groom={data.groomNickname || data.groomName}
        bride={data.brideNickname || data.brideName}
        target={data.receptionDate}
        ornament={ornElement}
      />

      <main className="sidebar-content">
        {/* Cover (after-open hero) */}
        <section id="cover" className="invite-section sidebar-cover" data-animate="fade">
          {cover ? (
            <div className="sidebar-cover-photo">
              <Image
                src={cover}
                alt="Couple"
                fill
                sizes="(max-width: 860px) 100vw, 60vw"
                className="sidebar-cover-image"
                priority
              />
              <div className="sidebar-cover-overlay" />
            </div>
          ) : null}
          <div className="sidebar-cover-inner">
            <Reveal animation="fadeInDown" className="eyebrow">The Wedding Celebration</Reveal>
            <Reveal as="h1" animation="zoomIn" delay={120} className="layout-display sidebar-cover-display">
              {data.groomNickname || data.groomName} <span className="amp">&amp;</span> {data.brideNickname || data.brideName}
            </Reveal>
            <Reveal animation="fadeInUp" delay={300} className="sidebar-cover-date">
              {formatDate(data.receptionDate) || "Save the date"}
            </Reveal>
            <Reveal animation="fadeInUp" delay={420}>
              <Countdown target={data.receptionDate} />
            </Reveal>
          </div>
        </section>

        {/* Quote */}
        {data.quote ? (
          <section id="quote" className="invite-section sidebar-quote-section">
            <Reveal animation="fadeInDown" className="eyebrow">Bismillah</Reveal>
            <Reveal as="blockquote" animation="zoomIn" delay={120} className="sidebar-quote">
              &ldquo;{data.quote}&rdquo;
            </Reveal>
            {data.openingText ? (
              <Reveal animation="fadeInUp" delay={240} className="opening-text">
                {data.openingText}
              </Reveal>
            ) : null}
          </section>
        ) : null}

        {/* Couple */}
        <section id="couple" className="invite-section sidebar-couple-section">
          <Reveal animation="fadeInDown" className="eyebrow">Mempelai</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">
            Pengantin
          </Reveal>
          <div className="sidebar-couple">
            <Reveal animation="fadeInLeft" delay={120} className="person-card sidebar-person">
              <div className="sidebar-person-frame">
                {gallery[0] ? (
                  <Image src={gallery[0]} alt="Mempelai Pria" width={420} height={520} className="sidebar-person-photo" />
                ) : (
                  <div className="person-avatar layout-display">{(data.groomNickname || data.groomName || "P").charAt(0)}</div>
                )}
              </div>
              <span className="person-label">Mempelai Pria</span>
              <h3 className="layout-display">{data.groomName || "Pengantin Pria"}</h3>
              <p>Putra dari Bapak {data.groomFather || "..."} & Ibu {data.groomMother || "..."}</p>
            </Reveal>
            <div className="sidebar-amp" aria-hidden>
              <em>&amp;</em>
            </div>
            <Reveal animation="fadeInRight" delay={240} className="person-card sidebar-person">
              <div className="sidebar-person-frame">
                {gallery[1] ? (
                  <Image src={gallery[1]} alt="Mempelai Wanita" width={420} height={520} className="sidebar-person-photo" />
                ) : (
                  <div className="person-avatar layout-display">{(data.brideNickname || data.brideName || "W").charAt(0)}</div>
                )}
              </div>
              <span className="person-label">Mempelai Wanita</span>
              <h3 className="layout-display">{data.brideName || "Pengantin Wanita"}</h3>
              <p>Putri dari Bapak {data.brideFather || "..."} & Ibu {data.brideMother || "..."}</p>
            </Reveal>
          </div>
        </section>

        {/* Event */}
        <section id="event" className="invite-section sidebar-event-section">
          <Reveal animation="fadeInDown" className="eyebrow">Save The Date</Reveal>
          <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">
            Detail Acara
          </Reveal>
          <div className="event-grid sidebar-events">
            <Reveal animation="fadeInLeft" delay={120}>
              <EventCard
                title="Akad / Pemberkatan"
                date={data.akadDate}
                time={data.akadTime}
                venue={data.akadVenue}
                address={data.akadAddress}
                maps={data.akadMaps}
              />
            </Reveal>
            <Reveal animation="fadeInRight" delay={240}>
              <EventCard
                title="Resepsi"
                date={data.receptionDate}
                time={data.receptionTime}
                venue={data.receptionVenue}
                address={data.receptionAddress}
                maps={data.receptionMaps}
              />
            </Reveal>
          </div>
        </section>

        {/* Story (BEFORE gallery per spec: cover→quote→couple→event→story→gallery) */}
        {data.story ? (
          <section id="story" className="invite-section sidebar-story-section">
            <Reveal animation="fadeInDown" className="eyebrow">Love Story</Reveal>
            <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">
              {data.storyTitle || "Cerita Kami"}
            </Reveal>
            <Reveal animation="fadeInUp" delay={240} className="story-text sidebar-story">
              {data.story}
            </Reveal>
          </section>
        ) : null}

        {/* Gallery */}
        {gallery.length ? (
          <section id="gallery" className="invite-section sidebar-gallery-section">
            <Reveal animation="fadeInDown" className="eyebrow">Our Moments</Reveal>
            <Reveal as="h2" animation="zoomIn" delay={120} className="layout-display section-title">
              Galeri
            </Reveal>
            <div className="invite-gallery sidebar-gallery">
              {gallery.slice(0, 8).map((url, index) => (
                <div
                  key={url}
                  className={`gallery-tile sidebar-tile ${index === 0 ? "feature" : ""} ${index === 3 ? "tall" : ""}`}
                >
                  <Image
                    src={url}
                    alt={`Galeri ${index + 1}`}
                    width={800}
                    height={1000}
                    sizes="(max-width: 860px) 50vw, 30vw"
                    className="gallery-image"
                    loading={index < 2 ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* Gift */}
        <section id="gift">
          <GiftSection
            giftBank={data.giftBank}
            giftAccount={data.giftAccount}
            giftName={data.giftName}
            giftQris={data.giftQris}
          />
        </section>

        {/* Ucapan = RSVP + Guestbook */}
        <section id="ucapan" className="sidebar-ucapan-wrap">
          <RsvpSection
            invitationId={invitation.id}
            preview={preview}
            guestName={guestName}
            guestSlug={guestSlug}
          />
          <GuestbookSection invitationId={invitation.id} preview={preview} />
        </section>

        <ShareSection slug={invitation.slug} premium={false} />

        {/* Thanks */}
        <footer id="thanks" className="invite-footer footer-sidebar" data-animate="fadeInUp">
          <div aria-hidden className="footer-orn">{ornElement}</div>
          <p>Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
          <strong className="layout-display sidebar-display">
            {data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}
          </strong>
        </footer>
      </main>
    </div>
  );
}

/**
 * Sticky sidebar (desktop) + sticky topbar (mobile). Tracks scroll spy
 * via IntersectionObserver and highlights the matching nav item.
 */
function SidebarRail({
  initials, groom, bride, target, ornament
}: {
  initials: string;
  groom: string;
  bride: string;
  target: string | undefined;
  ornament: React.ReactNode;
}) {
  const [active, setActive] = useState<string>("cover");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const targets = NAV
      .map((n) => document.getElementById(n.id))
      .filter((n): n is HTMLElement => !!n);
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, []);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <aside className="sidebar-rail" aria-label="Navigasi undangan">
      <div className="sidebar-rail-inner">
        <div className="sidebar-monogram" aria-hidden>
          <span>{initials}</span>
        </div>
        <div className="sidebar-couple-name layout-display">
          <span>{groom || "—"}</span>
          <em>&amp;</em>
          <span>{bride || "—"}</span>
        </div>
        <div className="sidebar-rail-orn" aria-hidden>{ornament}</div>
        <RailCountdown target={target} />
        <nav className="sidebar-nav" aria-label="Bagian undangan">
          <ul>
            {NAV.map((n) => (
              <li key={n.id} className={active === n.id ? "active" : ""}>
                <button type="button" onClick={() => jump(n.id)}>
                  <span className="dot" aria-hidden />
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}

function RailCountdown({ target }: { target: string | undefined }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);
  if (!target) return null;
  const date = new Date(target);
  if (Number.isNaN(date.getTime())) return null;
  const days = Math.max(0, Math.floor((date.getTime() - now) / 86_400_000));
  return (
    <div className="sidebar-countdown">
      <strong>{days}</strong>
      <small>hari lagi</small>
    </div>
  );
}
