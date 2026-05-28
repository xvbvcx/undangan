import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { TemplateGrid } from "@/components/TemplateGrid";
import { UrgencyCountdown } from "@/components/UrgencyCountdown";
import { FloatingActions } from "@/components/FloatingActions";
import { templates } from "@/lib/templates";

export default function HomePage() {
  return (
    <main className="landing-main">
      <SiteHeader />

      {/* Urgency banner — always sticky right under header */}
      <div className="urgency-wrap">
        <UrgencyCountdown />
      </div>

      <section className="hero-section landing-hero">
        <div className="hero-copy">
          <span className="eyebrow">Nikah Kilat · Gratis selamanya</span>
          <h1>Undangan pernikahan online ultra premium — 100% gratis.</h1>
          <p>
            75+ template eksklusif dengan animasi cinematic, scroll reveal,
            tema adat Nusantara, dan tanpa watermark. Buat, publish, dan
            share dalam hitungan menit. Tanpa bayar sepeser pun.
          </p>
          <div className="hero-actions">
            <Link href="#template" className="button gold">Lihat 75+ template</Link>
            <Link href="/register" className="button ghost">Mulai buat undangan</Link>
          </div>
          <div className="stat-row">
            <div><strong>75+</strong><span>template</span></div>
            <div><strong>13</strong><span>layout unik</span></div>
            <div><strong>5</strong><span>tema adat</span></div>
            <div><strong>100%</strong><span>gratis</span></div>
          </div>
          <ul className="hero-bullets">
            <li>✓ Cover gate &quot;Buka Undangan&quot;</li>
            <li>✓ Sticky sidebar templateku.id-style</li>
            <li>✓ Per-element animations (zoomIn, fadeIn)</li>
            <li>✓ Audio backsound floating</li>
          </ul>
        </div>
        <div className="hero-showcase">
          <div className="luxury-phone floating-a">
            <span>Ultra Premium</span>
            <h2>A &amp; R</h2>
            <p>Cinematic</p>
          </div>
          <div className="luxury-phone small floating-b">
            <span>Adat Jawa</span>
            <h2>N &amp; D</h2>
            <p>Batik Kawung</p>
          </div>
          <div className="luxury-phone tiny floating-c">
            <span>Sidebar</span>
            <h2>S &amp; B</h2>
            <p>templateku-style</p>
          </div>
          <div className="gold-ring" />
        </div>
      </section>

      <section className="section difference-section">
        <div className="section-head">
          <span className="eyebrow">Semua fitur premium — gratis</span>
          <h2>Yang biasanya berbayar di platform lain, di sini gratis tanpa syarat.</h2>
        </div>
        <div className="features-showcase">
          <div className="feature-box">
            <strong>13 Layout Berbeda</strong>
            <p>Sidebar, Classic, Floral, Botanical, Minimal, Editorial, Royal, Cinematic, Luxury, Postcard, Mosaic, Parallax, dan Adat Nusantara.</p>
          </div>
          <div className="feature-box">
            <strong>Per-Element Animation</strong>
            <p>zoomIn, fadeInUp, fadeInDown, fadeInLeft — IntersectionObserver bawaan, smooth tanpa library tambahan.</p>
          </div>
          <div className="feature-box">
            <strong>5 Tema Adat</strong>
            <p>Jawa (Batik Kawung), Aceh (Pintoe Aceh), Batak (Gorga), Minang (Rumah Gadang), Lampung (Siger).</p>
          </div>
          <div className="feature-box">
            <strong>Tanpa Watermark</strong>
            <p>Semua undangan bersih tanpa branding. Terlihat profesional dan personal.</p>
          </div>
          <div className="feature-box">
            <strong>RSVP + Guestbook + QR</strong>
            <p>Tamu konfirmasi kehadiran, kirim ucapan, dan share undangan via QR code / WhatsApp.</p>
          </div>
          <div className="feature-box">
            <strong>Cover Gate &amp; Audio</strong>
            <p>Modal &quot;Buka Undangan&quot; full-screen dengan background photo, plus floating audio toggle bottom-left.</p>
          </div>
        </div>
      </section>

      <TemplateGrid templates={templates} />

      <section className="section cta-section">
        <div>
          <span className="eyebrow">Siap publish</span>
          <h2>Buat undangan dalam 5 menit. Gratis. Tanpa batas.</h2>
          <p>Pilih template, isi data, upload foto, publish. Link langsung aktif untuk disebar ke tamu.</p>
        </div>
        <Link href="/register" className="button gold">Daftar &amp; buat undangan</Link>
      </section>

      <FloatingActions />
    </main>
  );
}
