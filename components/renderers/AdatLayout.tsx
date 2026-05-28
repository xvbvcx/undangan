"use client";

import Image from "next/image";
import { formatDate } from "@/lib/format";
import { AdatOrnament } from "@/components/renderers/AdatOrnaments";
import {
  Countdown, EventCard, GiftSection, GuestbookSection,
  MusicToggle, RsvpSection, ShareSection
} from "@/components/renderers/Shared";
import type { LayoutProps } from "@/components/renderers/types";

const CULTURE_LABELS = {
  jawa: { title: "Javanese Wedding", greeting: "Assalamu'alaikum Wr. Wb." },
  aceh: { title: "Acehnese Wedding", greeting: "Assalamu'alaikum Wr. Wb." },
  batak: { title: "Batak Wedding", greeting: "Horas!" },
  minang: { title: "Minangkabau Wedding", greeting: "Assalamu'alaikum Wr. Wb." },
  lampung: { title: "Lampung Wedding", greeting: "Assalamu'alaikum Wr. Wb." },
} as const;

export function AdatLayout({ invitation, template, data, preview,
  guestName, guestSlug, musicUrl, opened, onOpen }: LayoutProps) {
  const gallery = invitation.gallery_urls ?? [];
  const culture = template.culture ?? "jawa";
  const labels = CULTURE_LABELS[culture];

  if (!opened) {
    return (
      <section className={`invite-gate gate-adat gate-${culture}`}>
        <div className="gate-card adat-gate-card">
          <AdatOrnament culture={culture} className="adat-orn-top" size={180} />
          <span className="eyebrow adat-eyebrow">{labels.title}</span>

          <h1 className="layout-display adat-display">
            {data.groomNickname || data.groomName || "Mempelai"}
            <span className="adat-amp">&amp;</span>
            {data.brideNickname || data.brideName || "Pasangan"}
          </h1>
          {guestName ? (
            <div className="kepada-yth adat-yth">
              <span>Kepada Yth.</span>
              <strong>{guestName}</strong>
            </div>
          ) : null}
          <p className="adat-date">{formatDate(data.receptionDate) || "Save the date"}</p>
          <button type="button" className="button gold" onClick={onOpen}>Buka Undangan</button>
          <AdatOrnament culture={culture} className="adat-orn-bottom" size={160} />
        </div>
      </section>
    );
  }

  return (
    <>
      <MusicToggle src={musicUrl} />

      <section className="invite-hero hero-adat">
        <AdatOrnament culture={culture} className="adat-hero-orn" size={200} />
        <span className="eyebrow adat-eyebrow">{labels.title}</span>
        <h1 className="layout-display adat-display">
          {data.groomNickname || data.groomName}
          <span className="adat-amp">&amp;</span>
          {data.brideNickname || data.brideName}
        </h1>
        {data.quote ? <p className="hero-quote adat-quote">&ldquo;{data.quote}&rdquo;</p> : null}
        <div className="hero-date">{formatDate(data.receptionDate)}</div>
        <Countdown target={data.receptionDate} />
      </section>

      <section className="invite-section couple-section section-adat">
        <AdatOrnament culture={culture} className="section-orn-adat" size={100} />
        <span className="eyebrow adat-eyebrow">{labels.greeting}</span>
        {data.openingText ? <p className="opening-text">{data.openingText}</p> : null}
        <div className="couple-cards adat-couple">
          <article className="person-card adat-person">
            <div className="adat-person-frame">
              {gallery[0] ? (
                <Image src={gallery[0]} alt="Mempelai Pria" width={400} height={520} className="adat-person-photo" />
              ) : (
                <div className="person-avatar layout-display">{(data.groomNickname || data.groomName || "P").charAt(0)}</div>
              )}
            </div>
            <h2 className="layout-display">{data.groomName || "Pengantin Pria"}</h2>
            <p>Putra dari Bapak {data.groomFather || "..."} &amp; Ibu {data.groomMother || "..."}</p>
          </article>
          <div className="adat-divider" aria-hidden>
            <AdatOrnament culture={culture} size={70} />
          </div>
          <article className="person-card adat-person">
            <div className="adat-person-frame">
              {gallery[1] ? (
                <Image src={gallery[1]} alt="Mempelai Wanita" width={400} height={520} className="adat-person-photo" />
              ) : (
                <div className="person-avatar layout-display">{(data.brideNickname || data.brideName || "W").charAt(0)}</div>
              )}
            </div>
            <h2 className="layout-display">{data.brideName || "Pengantin Wanita"}</h2>
            <p>Putri dari Bapak {data.brideFather || "..."} &amp; Ibu {data.brideMother || "..."}</p>
          </article>
        </div>
      </section>


      <section className="invite-section event-section section-adat">
        <span className="eyebrow adat-eyebrow">Detail Acara</span>
        <h2 className="layout-display section-title">Save The Date</h2>
        <div className="event-grid">
          <EventCard title="Akad / Pemberkatan" date={data.akadDate} time={data.akadTime} venue={data.akadVenue} address={data.akadAddress} maps={data.akadMaps} />
          <EventCard title="Resepsi" date={data.receptionDate} time={data.receptionTime} venue={data.receptionVenue} address={data.receptionAddress} maps={data.receptionMaps} />
        </div>
      </section>

      {data.story ? (
        <section className="invite-section story-section section-adat">
          <span className="eyebrow adat-eyebrow">Love Story</span>
          <h2 className="layout-display section-title">{data.storyTitle || "Cerita Kami"}</h2>
          <p className="story-text">{data.story}</p>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="invite-section gallery-section section-adat">
          <span className="eyebrow adat-eyebrow">Galeri</span>
          <h2 className="layout-display section-title">Momen Kami</h2>
          <div className="invite-gallery gallery-grid-adat">
            {gallery.slice(0, 8).map((url, index) => (
              <div key={url} className={`gallery-tile adat-tile ${index === 0 ? "feature" : ""}`}>
                <Image src={url} alt={`Galeri ${index + 1}`} width={640} height={840} sizes="(max-width: 520px) 50vw, 33vw" className="gallery-image" loading={index < 2 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <GiftSection giftBank={data.giftBank} giftAccount={data.giftAccount} giftName={data.giftName} giftQris={data.giftQris} />
      <RsvpSection invitationId={invitation.id} preview={preview} guestName={guestName} guestSlug={guestSlug} />
      <GuestbookSection invitationId={invitation.id} preview={preview} />
      <ShareSection slug={invitation.slug} premium={false} />

      <footer className="invite-footer footer-adat">
        <AdatOrnament culture={culture} size={140} />
        <p>Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.</p>
        <strong className="layout-display adat-display">{data.groomNickname || data.groomName} &amp; {data.brideNickname || data.brideName}</strong>
      </footer>
    </>
  );
}
